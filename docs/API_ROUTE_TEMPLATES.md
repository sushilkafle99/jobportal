# API Route Templates

Quick copy-paste templates for different types of API routes using the new improvements.

## 1. Public GET List Route (No Auth Required)

```typescript
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { connectDatabase } from "@/lib/db-helper";
import Model from "@/models/Model";
import { ListResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    await connectDatabase();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const items = await Model.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Model.countDocuments();

    const response: ListResponse = { items, total, page, limit };
    return successResponse(response);
  } catch (error) {
    console.error("GET error:", error);
    return errorResponse("Failed to fetch items", 500);
  }
}
```

---

## 2. Protected POST Route (Auth Required)

```typescript
import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiErrors, withErrorHandling } from "@/lib/api-error";
import { getAuthContext, requireRole } from "@/lib/auth-middleware";
import { logRequest } from "@/lib/request-logger";
import { connectDatabase } from "@/lib/db-helper";
import Model from "@/models/Model";
import { createSchema } from "@/validations/schemas";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    logRequest(request, { action: "create_item" });

    // 1. Auth check
    const auth = await getAuthContext(request);
    requireRole(auth, "RECRUITER", "ADMIN");

    // 2. Validate input
    const body = await request.json();
    const validation = createSchema.safeParse(body);
    if (!validation.success) {
      throw ApiErrors.badRequest(
        "Validation failed",
        validation.error.flatten().fieldErrors,
      );
    }

    // 3. Database operation
    await connectDatabase();
    const item = await Model.create({
      ...validation.data,
      createdBy: auth.userId,
    });

    return successResponse(item.toJSON(), "Item created", 201);
  });
}
```

---

## 3. Protected PUT/PATCH Route (With Ownership Check)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiErrors, withErrorHandling } from "@/lib/api-error";
import { getAuthContext, requireOwnership } from "@/lib/auth-middleware";
import { connectDatabase } from "@/lib/db-helper";
import Model from "@/models/Model";
import { updateSchema } from "@/validations/schemas";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandling(async () => {
    const { id } = await params;
    const auth = await getAuthContext(request);

    await connectDatabase();

    const item = await Model.findById(id);
    if (!item) {
      throw ApiErrors.notFound("Item not found");
    }

    // Check ownership
    requireOwnership(auth, item.createdBy.toString());

    // Validate update data
    const body = await request.json();
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      throw ApiErrors.badRequest(
        "Validation failed",
        validation.error.flatten().fieldErrors,
      );
    }

    // Update and save
    const updated = await Model.findByIdAndUpdate(id, validation.data, {
      new: true,
    });
    return successResponse(updated.toJSON(), "Item updated");
  });
}
```

---

## 4. Admin DELETE Route (Admin Only)

```typescript
import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiErrors, withErrorHandling } from "@/lib/api-error";
import { getAuthContext, requireRole } from "@/lib/auth-middleware";
import { connectDatabase } from "@/lib/db-helper";
import Model from "@/models/Model";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandling(async () => {
    const { id } = await params;
    const auth = await getAuthContext(request);

    // Admin only
    requireRole(auth, "ADMIN");

    await connectDatabase();

    const item = await Model.findByIdAndDelete(id);
    if (!item) {
      throw ApiErrors.notFound("Item not found");
    }

    return successResponse({ id }, "Item deleted");
  });
}
```

---

## 5. Bulk Operation Route

```typescript
import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiErrors, withErrorHandling } from "@/lib/api-error";
import { getAuthContext, requireRole } from "@/lib/auth-middleware";
import { connectDatabase } from "@/lib/db-helper";
import Model from "@/models/Model";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const auth = await getAuthContext(request);
    requireRole(auth, "ADMIN");

    const body = await request.json();

    // Validate array of IDs
    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      throw ApiErrors.badRequest("Provide array of IDs");
    }

    await connectDatabase();

    const result = await Model.deleteMany({ _id: { $in: body.ids } });

    return successResponse(
      { deletedCount: result.deletedCount },
      `Deleted ${result.deletedCount} items`,
    );
  });
}
```

---

## 6. Search/Filter Route with Pagination

```typescript
import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { connectDatabase } from "@/lib/db-helper";
import { logRequest } from "@/lib/request-logger";
import Model from "@/models/Model";
import { ListResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    logRequest(request, { action: "search_items" });

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));

    // Filters
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "Active";

    await connectDatabase();

    // Build query
    const query: Record<string, unknown> = { status };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const items = await Model.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Model.countDocuments(query);

    const response: ListResponse = {
      items,
      total,
      page,
      limit,
    };

    return successResponse(response);
  } catch (error) {
    console.error("Search error:", error);
    return errorResponse("Search failed", 500);
  }
}
```

---

## 7. File Upload Route

```typescript
import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiErrors, withErrorHandling } from "@/lib/api-error";
import { getAuthContext } from "@/lib/auth-middleware";
import { connectDatabase } from "@/lib/db-helper";

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const auth = await getAuthContext(request);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw ApiErrors.badRequest("No file provided");
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      throw ApiErrors.badRequest("Invalid file type");
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw ApiErrors.badRequest("File too large (max 5MB)");
    }

    // Upload to storage (e.g., AWS S3, Cloudinary, etc.)
    // const url = await uploadToStorage(file);

    await connectDatabase();

    // Save metadata to DB
    // const record = await Model.create({ fileUrl: url, uploadedBy: auth.userId });

    return successResponse(
      { url: "https://example.com/file.pdf" },
      "File uploaded successfully",
      201,
    );
  });
}
```

---

## Import Cheatsheet

```typescript
// Response helpers
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api-response";

// Error handling
import { ApiErrors, withErrorHandling } from "@/lib/api-error";

// Auth
import {
  getAuthContext,
  requireRole,
  requireOwnership,
} from "@/lib/auth-middleware";

// Logging
import { logRequest, logResponse, measureTime } from "@/lib/request-logger";

// Database
import { connectDatabase, withDatabase } from "@/lib/db-helper";

// Types
import { User, Job, Company, ListResponse } from "@/types/api";

// Validations
import { jobSchema, companySchema, loginSchema } from "@/validations/schemas";

// Models
import Job from "@/models/Job";
import Company from "@/models/Company";
import User from "@/models/User";
```

---

## Common Patterns

### Conditional Field Inclusion

```typescript
const user = await User.findById(id);
if (!user) throw ApiErrors.notFound("User not found");

// Include sensitive fields only if user is self or admin
const userData = {
  id: user._id,
  name: user.name,
  email: user.email,
  ...(auth.userId === user._id.toString() ||
    (auth.role === "ADMIN" && {
      phone: user.phone,
      resumeUrl: user.resumeUrl,
    })),
};

return successResponse(userData);
```

### Relationship Population

```typescript
const jobs = await Job.find(query)
  .populate({
    path: "companyId",
    model: Company,
    select: "name logo location",
  })
  .sort({ createdAt: -1 });
```

### Handling Race Conditions

```typescript
const existing = await Model.findOne({ uniqueField: value });
if (existing) {
  throw ApiErrors.conflict("Item with this value already exists");
}

const item = await Model.create(data);
```
