import { describe, expect, it } from "vitest";

import {
  calculateInsuranceFee,
  calculateTotalWithInsurance,
  getInsuranceRate,
} from "@/lib/smart-insurance";

describe("smart-insurance", () => {
  it("uses 20% insurance for photography equipment", () => {
    expect(getInsuranceRate("fotografia-video")).toBe(0.2);
    expect(calculateInsuranceFee(200, "fotografia-video")).toBe(40);
    expect(calculateTotalWithInsurance(200, "fotografia-video")).toBe(240);
  });

  it("uses 10% insurance for non-photography equipment", () => {
    expect(getInsuranceRate("montana-camping")).toBe(0.1);
    expect(getInsuranceRate("deportes-acuaticos")).toBe(0.1);
    expect(calculateInsuranceFee(200, "montana-camping")).toBe(20);
    expect(calculateTotalWithInsurance(200, "deportes-acuaticos")).toBe(220);
  });

  it("throws for negative base price", () => {
    expect(() => calculateInsuranceFee(-1, "montana-camping")).toThrow(
      "Base price cannot be negative",
    );
  });
});