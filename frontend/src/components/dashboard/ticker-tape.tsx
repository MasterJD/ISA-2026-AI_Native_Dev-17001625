"use client";

import { Activity } from "lucide-react";

import { cn } from "@/lib/utils";

interface TickerTapeProps {
  symbols: string[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

export function TickerTape({ symbols, selectedSymbol, onSelectSymbol }: TickerTapeProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-3 shadow-glow">
      <div className="flex min-w-max items-center gap-3">
        {symbols.map((symbol) => {
          const active = symbol === selectedSymbol;
          return (
            <button
              key={symbol}
              type="button"
              onClick={() => onSelectSymbol(symbol)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "border-emerald-300/60 bg-emerald-400/20 text-emerald-100"
                  : "border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100",
              )}
            >
              <Activity className={cn("h-4 w-4", active ? "text-emerald-300" : "text-zinc-500")} />
              {symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
}
