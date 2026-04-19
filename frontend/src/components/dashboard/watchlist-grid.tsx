"use client";

import { ArrowRight } from "lucide-react";

import { useStockQuote } from "@/hooks/use-market-data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WatchlistGridProps {
  symbols: string[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

interface WatchlistAssetCardProps {
  symbol: string;
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

function WatchlistAssetCard({
  symbol,
  selectedSymbol,
  onSelectSymbol,
}: WatchlistAssetCardProps) {
  const quoteQuery = useStockQuote(symbol);
  const isSelected = symbol === selectedSymbol;

  return (
    <button
      type="button"
      onClick={() => onSelectSymbol(symbol)}
      className={cn(
        "rounded-xl border text-left transition-all",
        isSelected
          ? "border-emerald-300/60 bg-emerald-400/10"
          : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-600",
      )}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-zinc-100">{symbol}</p>
          <ArrowRight className={cn("h-4 w-4", isSelected ? "text-emerald-300" : "text-zinc-500")} />
        </div>
        <p className="mt-2 text-sm text-zinc-300">
          {quoteQuery.isLoading
            ? "Actualizando..."
            : quoteQuery.error
              ? "No disponible"
              : quoteQuery.data
                ? `$${quoteQuery.data.price.toFixed(2)}`
                : "-"}
        </p>
        <p
          className={cn(
            "text-xs",
            (quoteQuery.data?.change_percent ?? 0) >= 0 ? "text-emerald-300" : "text-rose-300",
          )}
        >
          {quoteQuery.data
            ? `${quoteQuery.data.change_percent.toFixed(2)}%`
            : quoteQuery.error
              ? "Error"
              : " "}
        </p>
      </div>
    </button>
  );
}

export function WatchlistGrid({
  symbols,
  selectedSymbol,
  onSelectSymbol,
}: WatchlistGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activos en Observacion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {symbols.map((symbol) => (
            <WatchlistAssetCard
              key={symbol}
              symbol={symbol}
              selectedSymbol={selectedSymbol}
              onSelectSymbol={onSelectSymbol}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
