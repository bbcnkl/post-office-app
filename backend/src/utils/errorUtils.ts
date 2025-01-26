import mongoose from "mongoose";

/**
 * Type guard to check if an error is a MongoDB duplicate key error.
 */
export function isMongoDuplicateKeyError(
  error: unknown
): error is mongoose.Error & { code: number; keyPattern: Record<string, any> } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as any).code === 11000 &&
    "keyPattern" in error
  );
}