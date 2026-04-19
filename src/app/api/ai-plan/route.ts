import { NextResponse } from "next/server";

import { generateTravelPlan } from "@/services/gemini";

export const runtime = "nodejs";

interface AiPlanRequest {
  destination?: string;
  context?: string;
}

export async function POST(request: Request) {
  let payload: AiPlanRequest;

  try {
    payload = (await request.json()) as AiPlanRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const destination = payload.destination?.trim() || "";
  const context = payload.context?.trim();

  if (!destination) {
    return NextResponse.json(
      { error: "destination is required" },
      { status: 400 },
    );
  }

  try {
    const plan = await generateTravelPlan(destination, context);
    return NextResponse.json({ plan });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate travel plan.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
