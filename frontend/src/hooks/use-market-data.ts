"use client";

import useSWR from "swr";

import {
  type ApiError,
  fetchGamificationStatus,
  fetchHealth,
  fetchSentiment,
  fetchStockHistory,
  fetchStockQuote,
} from "@/lib/api";
import type {
  GamificationStatus,
  HealthStatus,
  SentimentResult,
  StockHistory,
  StockQuote,
} from "@/types/api";

const pollingOptions = {
  refreshInterval: 60_000,
  revalidateOnFocus: false,
  keepPreviousData: true,
};

export function useHealthStatus(initialHealth?: HealthStatus) {
  return useSWR<HealthStatus, ApiError>("health-status", fetchHealth, {
    ...pollingOptions,
    fallbackData: initialHealth,
  });
}

export function useStockQuote(symbol: string) {
  return useSWR<StockQuote, ApiError>(
    symbol ? ["stock-quote", symbol] : null,
    ([, selectedSymbol]: [string, string]) => fetchStockQuote(selectedSymbol),
    pollingOptions,
  );
}

export function useStockHistory(symbol: string) {
  return useSWR<StockHistory, ApiError>(
    symbol ? ["stock-history", symbol] : null,
    ([, selectedSymbol]: [string, string]) => fetchStockHistory(selectedSymbol),
    pollingOptions,
  );
}

export function useSentiment(symbol: string) {
  return useSWR<SentimentResult, ApiError>(
    symbol ? ["stock-sentiment", symbol] : null,
    ([, selectedSymbol]: [string, string]) => fetchSentiment(selectedSymbol),
    pollingOptions,
  );
}

export function useGamificationStatus() {
  return useSWR<GamificationStatus, ApiError>(
    "gamification-status",
    fetchGamificationStatus,
    pollingOptions,
  );
}
