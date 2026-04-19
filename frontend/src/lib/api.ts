import { env } from "@/lib/env";
import type {
  GamificationStatus,
  HealthStatus,
  SentimentResult,
  StockHistory,
  StockQuote,
} from "@/types/api";

interface ErrorPayload {
  detail?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError("Error desconocido en la comunicacion con la API", 500);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;

    try {
      const payload = (await response.json()) as ErrorPayload;
      if (payload?.detail) {
        message = payload.detail;
      }
    } catch {
      // Ignore parsing errors and keep status-based message.
    }

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export function fetchHealth(): Promise<HealthStatus> {
  return request<HealthStatus>("/health");
}

export function fetchStockQuote(symbol: string): Promise<StockQuote> {
  return request<StockQuote>(`/stocks/${symbol}`);
}

export function fetchStockHistory(symbol: string): Promise<StockHistory> {
  return request<StockHistory>(`/stocks/${symbol}/history?period=1mo&interval=1d&limit=60`);
}

export function fetchSentiment(symbol: string): Promise<SentimentResult> {
  return request<SentimentResult>(`/sentiment/${symbol}`);
}

export function fetchGamificationStatus(): Promise<GamificationStatus> {
  return request<GamificationStatus>("/gamification/status");
}
