import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/gemini", () => ({
  generateTravelPlan: vi.fn(),
}));

import { generateTravelPlan } from "@/services/gemini";
import { POST } from "@/app/api/ai-plan/route";

const mockedGenerateTravelPlan = vi.mocked(generateTravelPlan);

describe("POST /api/ai-plan", () => {
  beforeEach(() => {
    mockedGenerateTravelPlan.mockReset();
  });

  it("returns 400 when destination is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/ai-plan", {
        method: "POST",
        body: JSON.stringify({ destination: "" }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("returns generated plan payload", async () => {
    mockedGenerateTravelPlan.mockResolvedValue({
      intro: "Test",
      days: [{ day: 1, title: "Dia 1", activities: ["A"] }],
      hiddenGem: { title: "HG", description: "DG" },
      localFood: { dish: "Dish", description: "Desc" },
    });

    const response = await POST(
      new Request("http://localhost/api/ai-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination: "Lima" }),
      }),
    );

    const payload = (await response.json()) as { plan?: unknown };

    expect(response.status).toBe(200);
    expect(payload.plan).toBeDefined();
    expect(mockedGenerateTravelPlan).toHaveBeenCalledWith("Lima", undefined);
  });
});
