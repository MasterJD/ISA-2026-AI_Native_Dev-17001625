import { NextRequest, NextResponse } from "next/server";

import { fetchRelated } from "@/services/unsplash";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location")?.trim() || "";
  const tagsParam = request.nextUrl.searchParams.get("tags")?.trim() || "";
  const excludedId = request.nextUrl.searchParams.get("excludedId")?.trim() || undefined;
  const fallbackCity = request.nextUrl.searchParams.get("fallbackCity")?.trim() || undefined;

  if (!location && !fallbackCity) {
    return NextResponse.json(
      { error: "location or fallbackCity is required" },
      { status: 400 },
    );
  }

  const tags = tagsParam
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  try {
    const destinations = await fetchRelated(
      location,
      tags,
      excludedId,
      fallbackCity,
    );

    return NextResponse.json({ destinations });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load related destinations.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
