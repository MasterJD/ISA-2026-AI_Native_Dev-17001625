"use client";

import { addDays, format } from "date-fns";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateRentalPrice } from "@/lib/date-utils";
import { calculateTotalWithInsurance } from "@/lib/smart-insurance";
import { rentalDateRangeSchema, rentalRequestSchema } from "@/lib/validation";
import type { GearItem } from "@/types/gear";

import { PriceSummary } from "./PriceSummary";

type FlowStep = "selection" | "configuration" | "summary" | "confirmed";

interface RentalFlowProps {
  item: GearItem;
  initialDateRange?: DateRange;
}

export function RentalFlow({ item, initialDateRange }: RentalFlowProps) {
  const [step, setStep] = useState<FlowStep>("selection");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialDateRange ?? {
      from: addDays(new Date(), 1),
      to: addDays(new Date(), 3),
    },
  );
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAt, setConfirmedAt] = useState<Date | null>(null);

  const fromDate = dateRange?.from;
  const toDate = dateRange?.to;
  const hasCompleteDateRange = Boolean(fromDate && toDate);

  const basePrice =
    fromDate && toDate ? calculateRentalPrice(item.dailyRate, fromDate, toDate) : 0;
  const totalPrice = calculateTotalWithInsurance(basePrice, item.categoryId);

  const continueToSummary = () => {
    if (!dateRange?.from || !dateRange.to) {
      setValidationMessage("Selecciona un rango de fechas válido.");
      return;
    }

    const result = rentalDateRangeSchema.safeParse({
      from: dateRange.from,
      to: dateRange.to,
    });

    if (!result.success) {
      setValidationMessage(result.error.issues[0]?.message ?? "Rango inválido.");
      return;
    }

    setValidationMessage(null);
    setStep("summary");
  };

  const confirmRental = async () => {
    if (!dateRange?.from || !dateRange.to) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = rentalRequestSchema.parse({
        gearId: item.id,
        categoryId: item.categoryId,
        dateRange: {
          from: dateRange.from,
          to: dateRange.to,
        },
        totalPrice,
      });

      const response = await fetch("/api/rentals/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Confirmation request failed");
      }

      setConfirmedAt(new Date());
      setStep("confirmed");
      toast.success("Renta confirmada", {
        description: `Tu reserva para ${item.name} ha sido registrada.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado";
      toast.error("No fue posible confirmar", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Flujo de renta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pb-6">
        {step === "selection" ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Revisa especificaciones técnicas y disponibilidad antes de configurar tu renta.
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              {Object.entries(item.technicalSpecs).map(([key, value]) => (
                <li key={key} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="capitalize">{key}</span>
                  <span className="font-medium">{value}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white">
              <span>Disponibilidad actual</span>
              <span className="font-semibold">
                {item.availability.inStock ? "Disponible" : "Sin stock"}
              </span>
            </div>
            <Button onClick={() => setStep("configuration")} disabled={!item.availability.inStock}>
              Continuar a fechas
            </Button>
          </div>
        ) : null}

        {step === "configuration" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-700">
              <CalendarDays className="h-4 w-4" />
              <p className="text-sm">Selecciona rango de fechas</p>
            </div>
            <Calendar
              mode="range"
              selected={dateRange}
              numberOfMonths={2}
              onSelect={(value) => {
                setDateRange(value);
                setValidationMessage(null);
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const current = new Date(date);
                current.setHours(0, 0, 0, 0);
                return current < today;
              }}
            />
            {validationMessage ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {validationMessage}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setStep("selection")}>
                Volver
              </Button>
              <Button onClick={continueToSummary}>Ver resumen</Button>
            </div>
          </div>
        ) : null}

        {step === "summary" && hasCompleteDateRange && fromDate && toDate ? (
          <div className="space-y-4">
            <PriceSummary
              dailyRate={item.dailyRate}
              categoryId={item.categoryId}
              from={fromDate}
              to={toDate}
            />
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setStep("configuration")}>
                Editar fechas
              </Button>
              <Button onClick={confirmRental} disabled={isSubmitting}>
                {isSubmitting ? "Confirmando..." : "Confirmar renta"}
              </Button>
            </div>
          </div>
        ) : null}

        {step === "confirmed" ? (
          <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-5 w-5" />
              <h4 className="text-base font-semibold">Rental Confirmed</h4>
            </div>
            <p className="text-sm text-emerald-900">
              Tu renta de <strong>{item.name}</strong> fue confirmada.
            </p>
            <p className="text-sm text-emerald-800">
              Fecha de confirmación: {confirmedAt ? format(confirmedAt, "dd/MM/yyyy HH:mm") : "-"}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setStep("configuration");
              }}
            >
              Crear otra renta
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
