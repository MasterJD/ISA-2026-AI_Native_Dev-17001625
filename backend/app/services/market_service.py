from datetime import UTC, datetime
from typing import Any

import yfinance as yf

from app.models.schemas import PricePoint, StockHistoryResponse, StockQuoteResponse


class MarketServiceError(RuntimeError):
    """Base exception for market service failures."""


class SymbolNotFoundError(MarketServiceError):
    """Raised when the symbol does not exist or has no quote data."""


class UpstreamMarketError(MarketServiceError):
    """Raised when yfinance or upstream data source fails."""


class MarketService:
    def fetch_quote(self, symbol: str) -> StockQuoteResponse:
        normalized_symbol = self._normalize_symbol(symbol)
        ticker = self._get_ticker(normalized_symbol)

        try:
            fast_info = dict(ticker.fast_info or {})
        except Exception as exc:
            raise UpstreamMarketError("Failed to fetch market quote from Yahoo Finance.") from exc

        if not fast_info:
            raise SymbolNotFoundError(f"Stock symbol '{normalized_symbol}' was not found.")

        price = self._as_float(
            fast_info.get("last_price") or fast_info.get("regular_market_price")
        )
        previous_close = self._as_float(
            fast_info.get("previous_close") or fast_info.get("regular_market_previous_close")
        )
        volume = self._as_int(
            fast_info.get("last_volume") or fast_info.get("regular_market_volume") or 0
        )

        if price is None:
            raise SymbolNotFoundError(
                f"Stock symbol '{normalized_symbol}' has no valid price data."
            )

        change = price - previous_close if previous_close is not None else 0.0
        change_percent = (change / previous_close * 100) if previous_close else 0.0

        return StockQuoteResponse(
            symbol=normalized_symbol,
            price=round(price, 4),
            change=round(change, 4),
            change_percent=round(change_percent, 4),
            volume=volume,
            timestamp=datetime.now(UTC),
        )

    def fetch_history(
        self,
        symbol: str,
        *,
        period: str = "1mo",
        interval: str = "1d",
        limit: int = 90,
    ) -> StockHistoryResponse:
        normalized_symbol = self._normalize_symbol(symbol)
        ticker = self._get_ticker(normalized_symbol)

        try:
            history = ticker.history(period=period, interval=interval, auto_adjust=False)
        except Exception as exc:
            raise UpstreamMarketError("Failed to fetch historical market data.") from exc

        if history is None or getattr(history, "empty", True):
            raise SymbolNotFoundError(f"Stock symbol '{normalized_symbol}' has no historical data.")

        points: list[PricePoint] = []
        for index, row in history.tail(limit).iterrows():
            close = self._as_float(row.get("Close"))
            if close is None:
                continue
            points.append(
                PricePoint(
                    timestamp=self._parse_datetime_index(index),
                    close=round(close, 4),
                )
            )

        if not points:
            raise SymbolNotFoundError(
                f"Stock symbol '{normalized_symbol}' has empty history points."
            )

        return StockHistoryResponse(symbol=normalized_symbol, interval=interval, points=points)

    def fetch_recent_headlines(self, symbol: str, *, limit: int = 5) -> list[str]:
        normalized_symbol = self._normalize_symbol(symbol)
        ticker = self._get_ticker(normalized_symbol)

        try:
            news = ticker.news or []
        except Exception as exc:
            raise UpstreamMarketError(
                "Failed to fetch market headlines from Yahoo Finance."
            ) from exc

        headlines = [
            item.get("title", "").strip()
            for item in news
            if isinstance(item, dict) and item.get("title")
        ]
        headlines = [headline for headline in headlines if headline]

        if headlines:
            return headlines[:limit]

        # If Yahoo has no headlines for a valid symbol, we still use live quote facts.
        quote = self.fetch_quote(normalized_symbol)
        return [
            (
                f"{normalized_symbol} cotiza en {quote.price:.2f} USD con variacion diaria "
                f"de {quote.change_percent:.2f}% y volumen de {quote.volume}."
            )
        ]

    def _get_ticker(self, symbol: str) -> yf.Ticker:
        return yf.Ticker(symbol)

    @staticmethod
    def _normalize_symbol(symbol: str) -> str:
        normalized = symbol.strip().upper()
        if not normalized:
            raise SymbolNotFoundError("Stock symbol is required.")
        return normalized

    @staticmethod
    def _as_float(value: Any) -> float | None:
        if value is None:
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _as_int(value: Any) -> int:
        try:
            return int(value)
        except (TypeError, ValueError):
            return 0

    @staticmethod
    def _parse_datetime_index(value: Any) -> datetime:
        if hasattr(value, "to_pydatetime"):
            dt = value.to_pydatetime()
        elif isinstance(value, datetime):
            dt = value
        else:
            dt = datetime.now(UTC)

        if dt.tzinfo is None:
            return dt.replace(tzinfo=UTC)
        return dt.astimezone(UTC)
