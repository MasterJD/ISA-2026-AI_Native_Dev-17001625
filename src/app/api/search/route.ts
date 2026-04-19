import { NextRequest, NextResponse } from "next/server";

import { fetchPopular, searchDestinations } from "@/services/unsplash";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query =
    request.nextUrl.searchParams.get("q") ??
    request.nextUrl.searchParams.get("query") ??
    "";

  if (query.length > 120) {
    return NextResponse.json({ error: "Search query is too long." }, { status: 400 });
  }

  try {
    const destinations = query.trim()
      ? await searchDestinations(query)
      : await fetchPopular();

    return NextResponse.json({ destinations });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load travel destinations.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
