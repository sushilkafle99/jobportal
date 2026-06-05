# Code Improvements & Developer Utilities

This document outlines the new utilities and patterns added to improve code quality, consistency, and maintainability.

## 📦 New Libraries

### 1. **API Response Helpers** (`src/lib/api-response.ts`)

Standardized response structure across all API routes.

```typescript
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api-response";

// Success response
return successResponse({ data: "example" }, "Operation successful");

// Error response
return errorResponse("Something went wrong", 500);

// Validation error response
return validationErrorResponse({ email: ["Invalid email"] });
```

**Benefits:**

- Consistent JSON structure across all endpoints
- Automatic timestamp inclusion
- Type-safe responses

---

### 2. **Error Handling** (`src/lib/api-error.ts`)

Custom error class and async wrapper for centralized error handling.

```typescript
import { ApiErrors, withErrorHandling } from "@/lib/api-error";

// Using custom errors
throw ApiErrors.unauthorized("Invalid credentials");
throw ApiErrors.notFound("User not found");
throw ApiErrors.forbidden("Access denied");

// Wrapping route handlers
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    // Your code here
    return successResponse(data);
  });
}
```

**Available errors:**

- `badRequest(message, errors?)`
- `unauthorized(message?)`
- `forbidden(message?)`
- `notFound(message?)`
- `conflict(message)`
- `internalServer(message?)`

---

### 3. **Environment Validation** (`src/lib/env.ts`)

Validate required environment variables at startup.

```typescript
import { validateEnvironment, getEnvVar } from "@/lib/env";

// Call once at app startup (in layout.tsx or API route)
validateEnvironment();

// Type-safe env var access
const mongoUri = getEnvVar("MONGODB_URI");
const jwtSecret = getEnvVar("JWT_SECRET", "default-secret");
```

**Add to `src/app/layout.tsx`:**

```typescript
import { validateEnvironment } from "@/lib/env";

// Run at app startup
if (typeof window === "undefined") {
  validateEnvironment();
}
```

---

### 4. **Auth Middleware** (`src/lib/auth-middleware.ts`)

Helpers for auth checks and role-based authorization.

```typescript
import {
  getAuthContext,
  requireRole,
  requireOwnership,
} from "@/lib/auth-middleware";
import { ApiErrors, withErrorHandling } from "@/lib/api-error";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const auth = await getAuthContext(request); // Throws if no token

    // Check role
    requireRole(auth, "RECRUITER", "ADMIN");

    // Check ownership
    requireOwnership(auth, userId);

    return successResponse(data);
  });
}
```

---

### 5. **Request Logging** (`src/lib/request-logger.ts`)

Debug logging and request metrics.

```typescript
import {
  logRequest,
  logResponse,
  measureTime,
  safeParseJson,
} from "@/lib/request-logger";

export async function GET(request: NextRequest) {
  const getTime = measureTime();
  logRequest(request, { action: "fetch_jobs" });

  try {
    const data = await fetchJobs();
    logResponse(request.url, 200, getTime(), { itemCount: data.length });
    return successResponse(data);
  } catch (error) {
    logResponse(request.url, 500, getTime(), { error: error.message });
    return errorResponse("Failed to fetch", 500);
  }
}

// Safe JSON parsing
const body = await safeParseJson(request); // Throws if invalid JSON
```

---

### 6. **API Types** (`src/types/api.ts`)

TypeScript interfaces for all API domain models.

```typescript
import { User, Job, Application, LoginResponse, ListResponse } from "@/types/api";

// Type-safe API responses
const loginData: LoginResponse = { user: {...}, token: "..." };
const jobs: ListResponse<Job> = { items: [...], total: 100 };
```

---

## 🔄 Migration Guide: Update Existing Routes

### Before (Old Pattern)

```typescript
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== "RECRUITER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const result = jobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // ... business logic ...

    return NextResponse.json({ message: "Success", data: result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
```

### After (New Pattern)

```typescript
import { successResponse, validationErrorResponse } from "@/lib/api-response";
import { ApiErrors, withErrorHandling } from "@/lib/api-error";
import { getAuthContext, requireRole } from "@/lib/auth-middleware";
import { logRequest } from "@/lib/request-logger";
import { Job } from "@/types/api";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    logRequest(request, { action: "create_job" });

    // Auth check
    const auth = await getAuthContext(request);
    requireRole(auth, "RECRUITER");

    // Validation
    const body = await request.json();
    const result = jobSchema.safeParse(body);
    if (!result.success) {
      throw ApiErrors.badRequest(
        "Validation failed",
        result.error.flatten().fieldErrors,
      );
    }

    // ... business logic ...
    const job: Job = {
      /* ... */
    };

    return successResponse<Job>(job, "Job created successfully", 201);
  });
}
```

---

## 📝 Route Handler Checklist

Use this when creating new API routes:

- [ ] Import error handlers and response helpers
- [ ] Wrap with `withErrorHandling`
- [ ] Call `logRequest()` at start
- [ ] Call `getAuthContext()` if authentication needed
- [ ] Call `requireRole()` if authorization needed
- [ ] Validate input with Zod and throw `ApiErrors.badRequest()`
- [ ] Use typed responses: `successResponse<T>()`, `errorResponse()`
- [ ] All errors throw `ApiError` or are caught by `withErrorHandling`

---

## 🚀 Next Steps

1. **Start migrating high-traffic routes** (auth, jobs, applications)
2. **Add tests for error scenarios** using the new error types
3. **Enable request logging in production** with a proper logger (Winston, Pino)
4. **Add rate limiting middleware** for API protection
5. **Create OpenAPI/Swagger spec** using the typed responses

---

## 📚 Files Reference

| File                         | Purpose                |
| ---------------------------- | ---------------------- |
| `src/lib/api-response.ts`    | Response helpers       |
| `src/lib/api-error.ts`       | Error handling         |
| `src/lib/env.ts`             | Environment validation |
| `src/lib/auth-middleware.ts` | Auth helpers           |
| `src/lib/request-logger.ts`  | Logging utilities      |
| `src/types/api.ts`           | TypeScript types       |
