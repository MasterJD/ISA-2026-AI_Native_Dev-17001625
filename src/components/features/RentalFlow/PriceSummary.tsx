import { format } from "date-fns";

import { calculateRentalDays, calculateRentalPrice } from "@/lib/date-utils";
import {
  calculateInsuranceFee,
  calculateTotalWithInsurance,
  getInsuranceRate,
} from "@/lib/smart-insurance";
import type { CategoryId } from "@/types/gear";

interface PriceSummaryProps {
  dailyRate: number;
  categoryId: CategoryId;
  from: Date;
  to: Date;
}

export function PriceSummary({
  dailyRate,
  categoryId,
  from,
  to,
}: PriceSummaryProps) {
  const totalDays = calculateRentalDays(from, to);
  const basePrice = calculateRentalPrice(dailyRate, from, to);
  const insuranceRate = getInsuranceRate(categoryId);
  const insuranceFee = calculateInsuranceFee(basePrice, categoryId);
  const totalPrice = calculateTotalWithInsurance(basePrice, categoryId);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <h4 className="text-sm font-semibold text-slate-900">Resumen de costos</h4>
      <div className="space-y-2 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Tarifa diaria</span>
          <span>${dailyRate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Días rentados</span>
          <span>{totalDays}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Subtotal renta</span>
          <span>${basePrice}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Smart Insurance ({Math.round(insuranceRate * 100)}%)</span>
          <span>${insuranceFee}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Rango</span>
          <span>
            {format(from, "dd/MM/yyyy")} - {format(to, "dd/MM/yyyy")}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <span className="text-sm font-semibold text-slate-900">Total</span>
        <span className="text-lg font-bold text-slate-900">${totalPrice}</span>
      </div>
    </div>
  );
}
