/**
 * Environment validation
 * Call this at app startup to ensure all required env vars are set
 */
export function validateEnvironment(): void {
  const requiredEnvVars = ["MONGODB_URI"];
  const optionalEnvVars = ["JWT_SECRET", "NODE_ENV"];

  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        `Please set them in .env.local or your hosting provider's environment settings.`,
    );
  }

  // Log optional vars for debugging
  const optionalSet = optionalEnvVars.filter((v) => process.env[v]);
  if (process.env.NODE_ENV === "development") {
    console.log("[ENV] Optional vars configured:", optionalSet.join(", "));
  }
}

/**
 * Get environment variable with type safety
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}
