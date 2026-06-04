import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token from cookies
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie ? tokenCookie.value : null;

  let payload = null;
  if (token) {
    payload = await verifyToken(token);
  }

  // 1. If trying to access authenticated routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isRecruiterRoute = pathname.startsWith("/recruiter");
  const isUserRoute = pathname.startsWith("/user");

  if (isAdminRoute || isRecruiterRoute || isUserRoute) {
    if (!payload) {
      // Not logged in -> Redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // RBAC Checks
    if (isAdminRoute && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (isRecruiterRoute && payload.role !== "RECRUITER") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (isUserRoute && payload.role !== "USER") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // 2. If logged in and trying to access auth pages (login, register, forgot-password)
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  if (isAuthRoute && payload) {
    // Redirect logged in user to their dashboard
    if (payload.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (payload.role === "RECRUITER") {
      return NextResponse.redirect(new URL("/recruiter/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/recruiter/:path*",
    "/user/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
