import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url("NEXT_PUBLIC_API_URL debe ser una URL valida")
    .refine(
      (value) => value.includes("/api/v1"),
      "NEXT_PUBLIC_API_URL debe incluir el prefijo /api/v1",
    ),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid frontend environment: ${message}`);
}

export const env = parsed.data;
