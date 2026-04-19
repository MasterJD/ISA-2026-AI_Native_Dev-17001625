from functools import lru_cache

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.config import Settings, get_settings
from app.models.schemas import (
    GamificationStatusResponse,
    HealthResponse,
    SentimentResponse,
    StockHistoryResponse,
    StockQuoteResponse,
)
from app.services.ai_service import AIService, AIServiceError, AIUpstreamError
from app.services.gamification_service import GamificationService
from app.services.market_service import MarketService, SymbolNotFoundError, UpstreamMarketError

router = APIRouter(prefix="/api/v1", tags=["api-v1"])
market_service = MarketService()
gamification_service = GamificationService()


@lru_cache
def _build_ai_service(api_key: str) -> AIService:
    return AIService(api_key=api_key)


def get_ai_service(settings: Settings = Depends(get_settings)) -> AIService:
    return _build_ai_service(settings.gemini_api_key.get_secret_value())


@router.get("/health", response_model=HealthResponse)
def get_health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    return HealthResponse(environment=settings.environment)


@router.get("/stocks/{symbol}", response_model=StockQuoteResponse)
def get_stock_quote(symbol: str) -> StockQuoteResponse:
    try:
        return market_service.fetch_quote(symbol)
    except SymbolNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except UpstreamMarketError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc


@router.get("/stocks/{symbol}/history", response_model=StockHistoryResponse)
def get_stock_history(
    symbol: str,
    period: str = Query(default="1mo", pattern=r"^(1d|5d|1mo|3mo|6mo|1y|2y)$"),
    interval: str = Query(default="1d", pattern=r"^(1m|5m|15m|30m|1h|1d|1wk)$"),
    limit: int = Query(default=60, ge=10, le=200),
) -> StockHistoryResponse:
    try:
        return market_service.fetch_history(symbol, period=period, interval=interval, limit=limit)
    except SymbolNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except UpstreamMarketError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc


@router.get("/sentiment/{symbol}", response_model=SentimentResponse)
def get_sentiment(
    symbol: str,
    ai_service: AIService = Depends(get_ai_service),
) -> SentimentResponse:
    try:
        quote = market_service.fetch_quote(symbol)
        headlines = market_service.fetch_recent_headlines(symbol)
    except SymbolNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except UpstreamMarketError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    try:
        return ai_service.analyze_sentiment(symbol=symbol, quote=quote, headlines=headlines)
    except AIUpstreamError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
    except AIServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc


@router.get("/gamification/status", response_model=GamificationStatusResponse)
def get_gamification_status() -> GamificationStatusResponse:
    return gamification_service.get_status()
