import { NextResponse } from "next/server";

import { rentalRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const rental = rentalRequestSchema.parse(payload);

    await new Promise((resolve) => {
      setTimeout(resolve, 850);
    });

    return NextResponse.json(
      {
        status: "confirmed",
        message: "Renta confirmada exitosamente.",
        rental,
      },
      { status: 200 },
    );
  } catch (error) {
    const details = error instanceof Error ? error.message : "Invalid request";

    return NextResponse.json(
      {
        status: "rejected",
        error: "No fue posible confirmar la renta.",
        details,
      },
      { status: 400 },
    );
  }
}
