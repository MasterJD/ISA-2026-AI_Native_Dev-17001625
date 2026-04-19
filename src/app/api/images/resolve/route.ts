import { NextResponse } from "next/server";
import { z } from "zod";

import { resolveGearImageURL } from "@/services/imageService";

const payloadSchema = z.object({
  gearId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = payloadSchema.parse(payload);
    const result = await resolveGearImageURL(parsed.gearId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json(
      {
        error: "Failed to resolve image",
        details: message,
      },
      { status: 400 },
    );
  }
}
