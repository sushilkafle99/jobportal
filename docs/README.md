# 📚 JobPortal Developer Documentation

Welcome to the JobPortal project! This folder contains comprehensive guides for understanding and developing the application.

## 🚀 Quick Start

1. **Setup Environment:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your MongoDB URI
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run Development Server:**

   ```bash
   npm run dev
   ```

4. **Visit:** `http://localhost:3000`

## 📖 Documentation Files

### Core Architecture

- **[PROJECT_ARCHITECTURE.md](./docs/PROJECT_ARCHITECTURE.md)** — START HERE
  - Project structure overview
  - Data models explanation
  - Database connection details
  - Auth flow
  - API route organization
  - Frontend structure

### Code Improvements (NEW!)

- **[IMPROVEMENTS_SUMMARY.md](./docs/IMPROVEMENTS_SUMMARY.md)** — Overview of all improvements
  - Before/after comparisons
  - Code quality metrics
  - Benefits of each utility

- **[IMPROVEMENTS.md](./docs/IMPROVEMENTS.md)** — Detailed developer guide
  - Each utility explained with examples
  - Migration guide for existing routes
  - Route handler checklist

### API Development

- **[API_ROUTE_TEMPLATES.md](./docs/API_ROUTE_TEMPLATES.md)** — Copy-paste ready templates
  - 7 common route patterns
  - File upload examples
  - Search/filter patterns
  - Import cheatsheet

## 🛠️ New Utilities (What Changed?)

The following utilities have been added to standardize and improve code quality:

| Utility                | File                         | Purpose                      |
| ---------------------- | ---------------------------- | ---------------------------- |
| Response helpers       | `src/lib/api-response.ts`    | Consistent API responses     |
| Error handling         | `src/lib/api-error.ts`       | Centralized error management |
| Environment validation | `src/lib/env.ts`             | Fail-fast on startup         |
| Auth middleware        | `src/lib/auth-middleware.ts` | Simplified auth checks       |
| Request logging        | `src/lib/request-logger.ts`  | Debugging and metrics        |
| Database wrapper       | `src/lib/db-helper.ts`       | DB error handling            |
| API types              | `src/types/api.ts`           | TypeScript type safety       |

## 📋 For New Developers

1. **Read First:** [PROJECT_ARCHITECTURE.md](./docs/PROJECT_ARCHITECTURE.md)
2. **Understand:** [IMPROVEMENTS_SUMMARY.md](./docs/IMPROVEMENTS_SUMMARY.md)
3. **When adding routes:** Use [API_ROUTE_TEMPLATES.md](./docs/API_ROUTE_TEMPLATES.md)

## 💡 Common Tasks

### Create a New API Endpoint

```bash
# 1. Create the route file
touch src/app/api/[resource]/route.ts

# 2. Copy template from API_ROUTE_TEMPLATES.md
# 3. Implement business logic
# 4. Test with curl or Postman
```

**Template:** See [API_ROUTE_TEMPLATES.md](./docs/API_ROUTE_TEMPLATES.md)

### Add a New Model

```bash
# 1. Create model file
touch src/models/NewModel.ts

# 2. Update types
# Edit src/types/api.ts and add your type

# 3. Create validation schema
# Add to src/validations/schemas.ts

# 4. Create API routes
# Follow templates in API_ROUTE_TEMPLATES.md
```

### Fix an Error Response

```typescript
// OLD (Bad)
return NextResponse.json({ message: "Error" }, { status: 500 });

// NEW (Good)
import { errorResponse } from "@/lib/api-response";
return errorResponse("Descriptive error message", 500);
```

### Add Authorization to Route

```typescript
// NEW pattern
import { getAuthContext, requireRole } from "@/lib/auth-middleware";

const auth = await getAuthContext(request); // Gets user or throws
requireRole(auth, "RECRUITER"); // Checks role or throws
requireOwnership(auth, resourceOwnerId); // Checks ownership or throws
```

## 🧪 Testing

### Manual API Testing

```bash
# Test a public endpoint
curl -X GET http://localhost:3000/api/jobs

# Test a protected endpoint
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{ "title": "Software Engineer", ... }'
```

### Using Postman

1. Import your API routes into Postman
2. Use the examples in [API_ROUTE_TEMPLATES.md](./docs/API_ROUTE_TEMPLATES.md)
3. Test different roles (USER, RECRUITER, ADMIN)

## 📚 Project Structure

```
JobPortal/
├── docs/                          # Documentation (YOU ARE HERE)
│   ├── PROJECT_ARCHITECTURE.md   # Overall structure
│   ├── IMPROVEMENTS_SUMMARY.md   # What's new
│   ├── IMPROVEMENTS.md           # Detailed guides
│   └── API_ROUTE_TEMPLATES.md    # Copy-paste templates
│
├── src/
│   ├── app/                      # Next.js App Router
│   ├── components/               # Reusable React components
│   ├── lib/                      # Utilities & helpers
│   │   ├── api-response.ts      # Response formatting
│   │   ├── api-error.ts         # Error handling
│   │   ├── auth-middleware.ts   # Auth helpers
│   │   ├── env.ts               # Environment validation
│   │   ├── request-logger.ts    # Logging utilities
│   │   └── db-helper.ts         # Database wrapper
│   ├── models/                   # Mongoose models
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Helper functions
│   └── validations/              # Zod schemas
│
├── public/                        # Static assets
├── .env.example                   # Environment template
├── package.json                   # Dependencies
└── README.md                      # Project overview
```

## 🔗 External Resources

- **Next.js:** https://nextjs.org/docs
- **Mongoose:** https://mongoosejs.com/docs/guide.html
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Zod Validation:** https://zod.dev
- **JWT:** https://jwt.io

## ❓ FAQ

**Q: How do I add a new field to User model?**
A:

1. Update `src/models/User.ts` - add field to schema
2. Update `src/types/api.ts` - add to `User` interface
3. Update related API routes and forms

**Q: How do I create a protected route?**
A: Use `getAuthContext()` at the start of your route handler. See [API_ROUTE_TEMPLATES.md](./docs/API_ROUTE_TEMPLATES.md#2-protected-post-route-auth-required)

**Q: Where do I add business logic validation?**
A: Use Zod schemas in `src/validations/schemas.ts` for input validation, then add business rules in the route handler.

**Q: How do I handle database errors?**
A: Use `connectDatabase()` and it will throw `ApiError` on failure. Wrap with `withErrorHandling()` for automatic catching.

**Q: Can I mix old and new error patterns?**
A: Not recommended. Standardize on the new patterns for consistency and maintainability.

## 📞 Support

- Check documentation in `docs/` folder first
- Review [API_ROUTE_TEMPLATES.md](./docs/API_ROUTE_TEMPLATES.md) for common patterns
- Look at existing routes for implementation examples

## ✅ Checklist for New Routes

- [ ] Used `withErrorHandling` wrapper
- [ ] Called `getAuthContext()` if protected
- [ ] Called `connectDatabase()`
- [ ] Validated input with Zod
- [ ] Used `successResponse()` or `errorResponse()`
- [ ] Added proper TypeScript types
- [ ] Tested with curl or Postman
- [ ] Added logging if complex logic

---

**Last Updated:** 2026-06-05
**Documentation Version:** 2.0 (With Improvements)
