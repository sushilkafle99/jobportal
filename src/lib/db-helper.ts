import { dbConnect as mongooseConnect } from "./db";
import { ApiErrors } from "./api-error";

/**
 * Wrapper around dbConnect with error handling
 */
export async function connectDatabase(): Promise<void> {
  try {
    await mongooseConnect();
  } catch (error) {
    console.error("[DB Connection Error]", error);
    throw ApiErrors.internalServer(
      "Failed to connect to database. Please try again later.",
    );
  }
}

/**
 * Database operation wrapper with error handling
 */
export async function withDatabase<T>(operation: () => Promise<T>): Promise<T> {
  try {
    await connectDatabase();
    return await operation();
  } catch (error) {
    if (error instanceof Error && error.message.includes("database")) {
      throw ApiErrors.internalServer("Database operation failed");
    }
    throw error;
  }
}
