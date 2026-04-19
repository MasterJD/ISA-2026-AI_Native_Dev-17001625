"use client";

import { useEffect, useRef, useState } from "react";
import { Gauge, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  useGamificationStatus,
  useSentiment,
  useStockHistory,
  useStockQuote,
} from "@/hooks/use-market-data";
import type { ApiError } from "@/lib/api";
import type { HealthStatus } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";

import { GamificationSidebar } from "./gamification-sidebar";
import { HealthCard } from "./health-card";
import { MarketOverview } from "./market-overview";
import { SentimentWidget } from "./sentiment-widget";
import { TickerTape } from "./ticker-tape";
import { WatchlistGrid } from "./watchlist-grid";

const WATCHLIST = ["AAPL", "MSFT", "NVDA", "TSLA", "BTC-USD", "ETH-USD"];

interface DashboardClientProps {
  initialHealth: HealthStatus | null;
  initialHealthError: string | null;
}

function useErrorToast(error: ApiError | undefined, fallbackMessage: string): void {
  const latestMessage = useRef<string | null>(null);

  useEffect(() => {
    if (!error) {
      return;
    }

    const message = error.message || fallbackMessage;
    if (latestMessage.current === message) {
      return;
    }

    toast.error(message);
    latestMessage.current = message;
  }, [error, fallbackMessage]);
}

export default function DashboardClient({
  initialHealth,
  initialHealthError,
}: DashboardClientProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(WATCHLIST[0]);

  const quoteQuery = useStockQuote(selectedSymbol);
  const historyQuery = useStockHistory(selectedSymbol);
  const sentimentQuery = useSentiment(selectedSymbol);
  const gamificationQuery = useGamificationStatus();

  useErrorToast(quoteQuery.error, "No se pudo cargar la cotizacion del activo.");
  useErrorToast(historyQuery.error, "No se pudo cargar el historial de precios.");
  useErrorToast(sentimentQuery.error, "No se pudo generar el sentimiento con IA.");
  useErrorToast(gamificationQuery.error, "No se pudo cargar la gamificacion.");

  useEffect(() => {
    if (initialHealthError) {
      toast.error(initialHealthError);
    }
  }, [initialHealthError]);

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 p-4 pb-10 sm:p-6 lg:p-8">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-950/80 p-6 shadow-glow">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-xs uppercase tracking-wider text-zinc-300">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-cyan-300" />
            TraderPulse AI Dashboard
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold text-zinc-100 sm:text-4xl">
            Analitica de mercado en tiempo real con señales IA y gamificacion operativa
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Selecciona un ticker para actualizar grafico, sentimiento y estado de riesgo con polling cada 60 segundos.
          </p>
        </div>
      </section>

      <TickerTape
        symbols={WATCHLIST}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={setSelectedSymbol}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
        <div className="space-y-5">
          <HealthCard initialHealth={initialHealth} initialError={initialHealthError} />

          <MarketOverview
            symbol={selectedSymbol}
            quote={quoteQuery.data}
            history={historyQuery.data}
            isLoading={quoteQuery.isLoading || historyQuery.isLoading}
          />

          <SentimentWidget
            symbol={selectedSymbol}
            sentiment={sentimentQuery.data}
            isLoading={sentimentQuery.isLoading}
          />

          <WatchlistGrid
            symbols={WATCHLIST}
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
          />
        </div>

        <div className="space-y-5">
          <GamificationSidebar status={gamificationQuery.data} isLoading={gamificationQuery.isLoading} />

          <Card>
            <CardContent className="pt-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Gauge className="h-4 w-4 text-emerald-300" />
                Estado Operativo
              </p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>Actualizacion de mercado: cada 60 segundos.</li>
                <li>Errores de proveedor: notificados por toast en tiempo real.</li>
                <li>Politica de datos: sin fallback para mercado o IA.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
