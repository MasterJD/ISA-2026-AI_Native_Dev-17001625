from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: Literal["active"] = "active"
    version: str = "1.0.0"
    environment: Literal["development", "production"]


class StockQuoteResponse(BaseModel):
    symbol: str
    price: float
    change: float
    change_percent: float
    volume: int
    timestamp: datetime


class PricePoint(BaseModel):
    timestamp: datetime
    close: float


class StockHistoryResponse(BaseModel):
    symbol: str
    interval: str
    points: list[PricePoint]


class SentimentResponse(BaseModel):
    symbol: str
    sentiment: Literal["Bullish", "Bearish", "Neutral"]
    justification: str = Field(min_length=8, max_length=500)
    source_model: str


class GamificationStatusResponse(BaseModel):
    user_id: str = "demo-user"
    level_name: str
    level: int = Field(ge=1)
    points: int = Field(ge=0)
    next_level_points: int = Field(ge=1)
    progress_percent: float = Field(ge=0, le=100)
    badges: list[str]
