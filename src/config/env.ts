import "server-only";

import { z } from "zod";

const envSchema = z.object({
  GCS_BUCKET_NAME: z
    .string()
    .min(3, "GCS_BUCKET_NAME must contain at least 3 characters")
    .regex(
      /^[a-z0-9][a-z0-9._-]{1,220}[a-z0-9]$/,
      "GCS_BUCKET_NAME has an invalid bucket naming format",
    ),
  GCS_PROJECT_ID: z
    .string()
    .min(4, "GCS_PROJECT_ID is required and must look like a GCP project id")
    .regex(
      /^[a-z][a-z0-9-]{4,61}[a-z0-9]$/,
      "GCS_PROJECT_ID must use lowercase letters, numbers, and dashes",
    ),
  GOOGLE_APPLICATION_CREDENTIALS: z
    .string()
    .min(5, "GOOGLE_APPLICATION_CREDENTIALS is required")
    .refine(
      (value) => value.toLowerCase().endsWith(".json"),
      "GOOGLE_APPLICATION_CREDENTIALS must point to a .json service account key",
    ),
  NANO_BANANA_API_KEY: z
    .string()
    .min(10, "NANO_BANANA_API_KEY is required and appears malformed"),
});

const parseResult = envSchema.safeParse({
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
  GCS_PROJECT_ID: process.env.GCS_PROJECT_ID,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  NANO_BANANA_API_KEY: process.env.NANO_BANANA_API_KEY,
});

if (!parseResult.success) {
  const formatted = parseResult.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(
    [
      "Invalid server configuration. The app cannot start with broken environment variables.",
      "Fix the following variables:",
      formatted,
    ].join("\n"),
  );
}

export const env = parseResult.data;
