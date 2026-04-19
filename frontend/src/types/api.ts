export type RuntimeEnvironment = "development" | "production";

export interface HealthStatus {
  status: "active";
  version: string;
  environment: RuntimeEnvironment;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  timestamp: string;
}

export interface PricePoint {
  timestamp: string;
  close: number;
}

export interface StockHistory {
  symbol: string;
  interval: string;
  points: PricePoint[];
}

export type SentimentLabel = "Bullish" | "Bearish" | "Neutral";

export interface SentimentResult {
  symbol: string;
  sentiment: SentimentLabel;
  justification: string;
  source_model: string;
}

export interface GamificationStatus {
  user_id: string;
  level_name: string;
  level: number;
  points: number;
  next_level_points: number;
  progress_percent: number;
  badges: string[];
}
