import { describe, expect, it } from "vitest";

import { generateTravelPlan } from "@/services/gemini";

describe("generateTravelPlan", () => {
  it("returns structured plan", async () => {
    const plan = await generateTravelPlan("Lisboa", "viaje de 3 dias");

    expect(plan.intro.length).toBeGreaterThan(0);
    expect(plan.days).toHaveLength(3);
    expect(plan.days[0].activities.length).toBeGreaterThan(0);
    expect(plan.hiddenGem.title.length).toBeGreaterThan(0);
    expect(plan.localFood.dish.length).toBeGreaterThan(0);
  });

  it("throws for empty destination", async () => {
    await expect(generateTravelPlan("   ")).rejects.toThrow(
      "destination is required",
    );
  });
});
