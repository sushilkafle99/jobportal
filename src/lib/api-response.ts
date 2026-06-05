import { NextResponse } from "next/server";

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
  timestamp: string;
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message: string = "Success",
  status: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  message: string,
  status: number = 500,
  errors?: Record<string, string[]>,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

/**
 * Validation error response
 */
export function validationErrorResponse(
  errors: Record<string, string[]>,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message: "Validation failed",
      errors,
      timestamp: new Date().toISOString(),
    },
    { status: 400 },
  );
}
