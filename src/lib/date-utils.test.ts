import { describe, expect, it } from "vitest";

import { calculateRentalDays, calculateRentalPrice } from "@/lib/date-utils";

describe("date-utils", () => {
  it("calculates a one-day rental correctly", () => {
    const start = new Date(2026, 4, 10, 10, 0, 0);
    const end = new Date(2026, 4, 10, 23, 59, 0);

    expect(calculateRentalDays(start, end)).toBe(1);
    expect(calculateRentalPrice(80, start, end)).toBe(80);
  });

  it("calculates a one-week rental correctly", () => {
    const start = new Date(2026, 4, 1, 9, 0, 0);
    const end = new Date(2026, 4, 7, 18, 0, 0);

    expect(calculateRentalDays(start, end)).toBe(7);
    expect(calculateRentalPrice(45, start, end)).toBe(315);
  });

  it("calculates rentals spanning different months", () => {
    const start = new Date(2026, 0, 30, 12, 0, 0);
    const end = new Date(2026, 1, 2, 8, 0, 0);

    expect(calculateRentalDays(start, end)).toBe(4);
    expect(calculateRentalPrice(100, start, end)).toBe(400);
  });
});
