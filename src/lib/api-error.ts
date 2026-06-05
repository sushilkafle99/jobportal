import { NextResponse } from "next/server";
import { errorResponse } from "./api-response";

/**
 * Custom API error class for standardized error handling
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Common error handlers
 */
export const ApiErrors = {
  badRequest: (message: string, errors?: Record<string, string[]>) =>
    new ApiError(400, message, errors),

  unauthorized: (message: string = "Unauthorized") =>
    new ApiError(401, message),

  forbidden: (message: string = "Access forbidden") =>
    new ApiError(403, message),

  notFound: (message: string = "Resource not found") =>
    new ApiError(404, message),

  conflict: (message: string) => new ApiError(409, message),

  internalServer: (message: string = "Internal server error") =>
    new ApiError(500, message),
};

/**
 * Async route handler wrapper with error handling
 */
export async function withErrorHandling<T>(
  handler: () => Promise<NextResponse<T>>,
): Promise<NextResponse<any>> {
  try {
    return await handler();
  } catch (error) {
    console.error("Route error:", error);

    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode, error.errors);
    }

    if (error instanceof SyntaxError) {
      return errorResponse("Invalid request body", 400);
    }

    return errorResponse("Internal server error", 500);
  }
}
