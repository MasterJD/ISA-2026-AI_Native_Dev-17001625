"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockHistory, StockQuote } from "@/types/api";

interface MarketOverviewProps {
  symbol: string;
  quote?: StockQuote;
  history?: StockHistory;
  isLoading: boolean;
}

export function MarketOverview({
  symbol,
  quote,
  history,
  isLoading,
}: MarketOverviewProps) {
  const chartData = (history?.points ?? []).map((point) => ({
    label: new Date(point.timestamp).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    }),
    price: point.close,
  }));

  const changeIsPositive = (quote?.change ?? 0) >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{symbol} en Tiempo Real</CardTitle>
        <CardDescription>
          Evolucion de precio y variacion diaria para el activo seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Precio</p>
            <p className="text-xl font-semibold text-zinc-100">
              {quote ? `$${quote.price.toFixed(2)}` : isLoading ? "Cargando..." : "-"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Cambio</p>
            <p
              className={`inline-flex items-center text-xl font-semibold ${
                changeIsPositive ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {changeIsPositive ? (
                <TrendingUp className="mr-1 h-4 w-4" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4" />
              )}
              {quote ? `${quote.change_percent.toFixed(2)}%` : isLoading ? "..." : "-"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Volumen</p>
            <p className="text-xl font-semibold text-zinc-100">
              {quote ? quote.volume.toLocaleString("es-ES") : isLoading ? "..." : "-"}
            </p>
          </div>
        </div>

        <div className="h-64 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#2b2f3a" strokeDasharray="4 4" />
                <XAxis dataKey="label" stroke="#9ca3af" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#9ca3af"
                  tickLine={false}
                  axisLine={false}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#090c16",
                    border: "1px solid #2b2f3a",
                    borderRadius: 12,
                    color: "#f4f4f5",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={changeIsPositive ? "#34d399" : "#fb7185"}
                  strokeWidth={2.6}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center text-sm text-zinc-400">
              {isLoading
                ? "Actualizando historial de mercado..."
                : "No hay historial disponible para este activo."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
