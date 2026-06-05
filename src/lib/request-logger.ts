import { NextRequest, NextResponse } from "next/server";

/**
 * Log request details for debugging and monitoring
 */
export function logRequest(
  request: NextRequest,
  context?: Record<string, unknown>,
): void {
  const method = request.method;
  const pathname = new URL(request.url).pathname;
  const timestamp = new Date().toISOString();

  const logData: Record<string, unknown> = {
    timestamp,
    method,
    pathname,
    ...context,
  };

  if (process.env.NODE_ENV === "development") {
    console.log("[API]", JSON.stringify(logData, null, 2));
  }
}

/**
 * Log response details
 */
export function logResponse(
  pathname: string,
  status: number,
  duration: number,
  context?: Record<string, unknown>,
): void {
  const logData: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    pathname,
    status,
    durationMs: duration,
    ...context,
  };

  if (process.env.NODE_ENV === "development") {
    console.log("[API RESPONSE]", JSON.stringify(logData, null, 2));
  }
}

/**
 * Measure request duration
 */
export function measureTime(): () => number {
  const start = Date.now();
  return () => Date.now() - start;
}

/**
 * Safe JSON parsing with error handling
 */
export async function safeParseJson<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error("Invalid JSON in request body");
  }
}
