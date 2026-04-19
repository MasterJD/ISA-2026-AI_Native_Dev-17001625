import type { CategoryId } from "@/types/gear";

export const PHOTOGRAPHY_INSURANCE_RATE = 0.2;
export const DEFAULT_INSURANCE_RATE = 0.1;

export function getInsuranceRate(categoryId: CategoryId): number {
  return categoryId === "fotografia-video"
    ? PHOTOGRAPHY_INSURANCE_RATE
    : DEFAULT_INSURANCE_RATE;
}

export function calculateInsuranceFee(
  basePrice: number,
  categoryId: CategoryId,
): number {
  if (basePrice < 0) {
    throw new Error("Base price cannot be negative");
  }

  return Number((basePrice * getInsuranceRate(categoryId)).toFixed(2));
}

export function calculateTotalWithInsurance(
  basePrice: number,
  categoryId: CategoryId,
): number {
  const insuranceFee = calculateInsuranceFee(basePrice, categoryId);
  return Number((basePrice + insuranceFee).toFixed(2));
}