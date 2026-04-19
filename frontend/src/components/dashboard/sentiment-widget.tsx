"use client";

import { BrainCircuit, Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SentimentResult } from "@/types/api";

interface SentimentWidgetProps {
  symbol: string;
  sentiment?: SentimentResult;
  isLoading: boolean;
}

export function SentimentWidget({
  symbol,
  sentiment,
  isLoading,
}: SentimentWidgetProps) {
  const label = sentiment?.sentiment ?? "Neutral";

  const tone =
    label === "Bullish"
      ? {
          badge: "default" as const,
          icon: <TrendingUp className="h-4 w-4 text-emerald-300" />,
          text: "Alcista",
        }
      : label === "Bearish"
        ? {
            badge: "destructive" as const,
            icon: <TrendingDown className="h-4 w-4 text-rose-300" />,
            text: "Bajista",
          }
        : {
            badge: "secondary" as const,
            icon: <Minus className="h-4 w-4 text-zinc-300" />,
            text: "Neutral",
          };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BrainCircuit className="h-5 w-5 text-cyan-300" />
            Analisis IA de Sentimiento
          </CardTitle>
          <CardDescription>Gemini 3 Flash resume contexto del activo {symbol}</CardDescription>
        </div>
        <Badge variant={tone.badge} className="w-fit">
          {tone.icon}
          <span className="ml-1">{tone.text}</span>
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-sm leading-relaxed text-zinc-200">
          {isLoading
            ? "Procesando sentimiento con IA..."
            : sentiment?.justification ??
              "No fue posible obtener un analisis de sentimiento para este activo."}
        </p>
      </CardContent>
    </Card>
  );
}
