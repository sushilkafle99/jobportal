# JobPortal — Project Architecture & Developer Guide

This document explains how the JobPortal project is organized, how the main parts work, and where to find key implementation details. It is intended for developers who will maintain or extend the app.

## Quick summary

- Framework: Next.js (app router) + TypeScript
- DB: MongoDB via Mongoose (connection helper in `src/lib/db.ts`)
- Auth: JWT-based with helper functions in `src/utils/auth.ts` and API routes under `src/app/api/auth`.

## Getting started

1. Copy `.env.example` to `.env.local` and set `MONGODB_URI` and `JWT_SECRET`.
2. Install dependencies: `npm install` or `pnpm install`.
3. Run dev server: `npm run dev`.

Key files:

- DB connect: [src/lib/db.ts](src/lib/db.ts)
- Auth helpers: [src/utils/auth.ts](src/utils/auth.ts)
- App root layout: [src/app/layout.tsx](src/app/layout.tsx)

## Environment variables

- `MONGODB_URI` — MongoDB connection string (required)
- `JWT_SECRET` — secret used to sign JWTs (recommended to set in production)

## Data layer (Mongoose models)

Models are in `src/models`. Each model maps to a MongoDB collection and is used across API routes.

- User: [src/models/User.ts](src/models/User.ts)
  - Fields: `name`, `email`, `password`, `role` (ADMIN|RECRUITER|USER), `profileImage`, `phone`, `location`, `resumeUrl`, `isActive`, timestamps

- Company: [src/models/Company.ts](src/models/Company.ts)
  - Fields: `name`, `logo`, `website`, `description`, `industry`, `location`, `employeeCount`, `foundedYear`, `createdBy`, timestamps

- Job: [src/models/Job.ts](src/models/Job.ts)
  - Fields: `title`, `description`, `requirements` (array), `responsibilities` (array), `salaryMin`, `salaryMax`, `experienceLevel`, `employmentType`, `location`, `category`, `skills`, `status`, `companyId`, `recruiterId`, timestamps

- Application: [src/models/Application.ts](src/models/Application.ts)
  - Fields: `jobId`, `userId`, `resumeUrl`, `coverLetter`, `status`, `appliedAt`, timestamps

- Recruiter: [src/models/Recruiter.ts](src/models/Recruiter.ts)
  - Fields: `userId`, `companyId`, `verified`, timestamps

- SavedJob: [src/models/SavedJob.ts](src/models/SavedJob.ts)
  - Fields: `userId`, `jobId`, timestamps (unique index on `userId+jobId`)

## Database connection

The `dbConnect` helper caches the Mongoose connection to avoid reconnecting on serverless cold starts. See [src/lib/db.ts](src/lib/db.ts).

Usage (typical pattern in API routes):

- call `await dbConnect()` at the top of a route handler before performing model operations.

## Auth flow

- Passwords are hashed using bcrypt via `hashPassword` in [src/utils/auth.ts](src/utils/auth.ts).
- Tokens are signed using `SignJWT` (JOSE) in `signToken` and verified with `verifyToken`.
- API routes under `src/app/api/auth/*` handle register, login, logout, and `me` endpoints. Those API routes should validate credentials, create or fetch users, and return a signed JWT on success.

Client-side handling:

- The app includes UI pages under `src/app/(auth)/` for login, register, and forgot-password.
- Protected pages use `ProtectedRoute` component in `src/components/ProtectedRoute.tsx` (server/client bridging pattern) to ensure users are redirected to login when unauthorized.

## API routes (app router)

- Routes live under `src/app/api/*` using Next.js Route Handlers (`route.ts`).
- Main groups:
  - `src/app/api/auth/*` — authentication endpoints
  - `src/app/api/jobs/*` — create, list, update, delete jobs
  - `src/app/api/companies/*` — company CRUD
  - `src/app/api/applications/*` — apply and manage applications
  - `src/app/api/users/*` — user listing and profile endpoints

Each route should:

1. Call `await dbConnect()`
2. Parse and validate input (use `validations/schemas.ts` where appropriate)
3. Use Mongoose models to perform DB actions
4. Return standard JSON responses and HTTP status codes

## Frontend structure

- The app uses the Next.js `app` directory. Primary UX areas live under `src/app/`:
  - `(public)` — public pages like home, about, jobs listing
  - `(auth)` — authentication flows
  - `admin`, `recruiter`, `user` — role-scoped sections with their own `layout.tsx` and pages

- Shared UI components live in `src/components` (Navbar, Footer, JobCard, CompanyCard, DataTable, etc.).
- The top-level CSS is in `src/app/globals.css` and component-level styling is in the components or module CSS when used.

Client/server patterns:

- UI components that use browser-only features are client components (React state/hooks). Shared presentational components can be server components for faster SSR.

## Important components and responsibilities

- `src/components/Navbar.tsx` — navigation, shows login state and links
- `src/components/ProtectedRoute.tsx` — guards pages based on JWT/role
- `src/components/DataTable.tsx` — reusable table used in admin lists
- `src/components/JobCard.tsx`, `src/components/CompanyCard.tsx`, `src/components/ApplicationCard.tsx` — small presentational blocks used across listings

## Validation

- Input validation schemas are in `src/validations/schemas.ts`. Use them on the server (API routes) before persisting to DB.

## How to add a new API endpoint

1. Add a handler in `src/app/api/<resource>/route.ts` or a nested `route.ts` for specific ids.
2. Call `await dbConnect()` at the top.
3. Import the model from `src/models` and perform the CRUD logic.
4. Validate input and return JSON with appropriate status codes.

## Deployment notes

- Ensure `MONGODB_URI` and `JWT_SECRET` are set in production environment variables.
- For Vercel: the app router works out of the box; ensure serverless functions have access to `MONGODB_URI` and the project uses the cached `dbConnect` to avoid connection limits.

## Testing and local checks

- Use manual testing via the running dev server and Postman for API endpoints.
- Consider adding unit tests for `utils` functions (auth hashing, token signing) and integration tests that run against a test MongoDB instance.

## Where to look for common changes

- Add fields to schemas: `src/models/*.ts` then update API routes and frontend forms.
- Change auth behavior: `src/utils/auth.ts` and `src/app/api/auth/*`.
- Change DB connection: `src/lib/db.ts`.

## Next steps / Suggested improvements

✅ **Recently Added Improvements:**

- Centralized API response helpers (`src/lib/api-response.ts`)
- Robust error handling with `ApiError` class (`src/lib/api-error.ts`)
- Environment validation at startup (`src/lib/env.ts`)
- TypeScript types for all API responses (`src/types/api.ts`)
- Auth middleware helpers (`src/lib/auth-middleware.ts`)
- Request logging and metrics (`src/lib/request-logger.ts`)

📚 **Documentation:**

- [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md) — Overview of all improvements
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) — Detailed developer guide with examples
- [API_ROUTE_TEMPLATES.md](./API_ROUTE_TEMPLATES.md) — Copy-paste templates for common route patterns

⏳ **Future Improvements:**

- Add automated tests (Jest/Playwright) and CI.
- Add OpenAPI/Swagger spec for the API routes.
- Enable request rate limiting and DDoS protection.
- Add comprehensive error logging (Winston, Pino).
- Implement caching strategy for frequently accessed data.

---

**Quick Links:**

- [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) — This file, overall structure
- [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md) — New utilities added
- [API_ROUTE_TEMPLATES.md](./API_ROUTE_TEMPLATES.md) — Copy-paste templates
