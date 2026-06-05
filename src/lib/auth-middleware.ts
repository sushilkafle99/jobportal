import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth";
import { ApiErrors } from "./api-error";

/**
 * JWT payload type
 */
export interface AuthContext {
  userId: string;
  role: "ADMIN" | "RECRUITER" | "USER";
  email: string;
}

/**
 * Extract and verify auth token from request
 */
export async function getAuthContext(
  request: NextRequest,
): Promise<AuthContext> {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    throw ApiErrors.unauthorized("Missing authentication token");
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    throw ApiErrors.unauthorized("Invalid or expired token");
  }

  return {
    userId: decoded.userId,
    role: decoded.role,
    email: decoded.email,
  };
}

/**
 * Require specific role(s)
 */
export function requireRole(
  auth: AuthContext,
  ...roles: AuthContext["role"][]
): void {
  if (!roles.includes(auth.role)) {
    throw ApiErrors.forbidden(
      `This action requires one of these roles: ${roles.join(", ")}`,
    );
  }
}

/**
 * Check if user owns a resource (e.g., their own profile)
 */
export function requireOwnership(
  auth: AuthContext,
  resourceOwnerId: string,
): void {
  if (auth.userId !== resourceOwnerId && auth.role !== "ADMIN") {
    throw ApiErrors.forbidden(
      "You do not have permission to access this resource",
    );
  }
}
