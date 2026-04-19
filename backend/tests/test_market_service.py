from datetime import UTC, datetime, timedelta

import pandas as pd
import pytest

from app.services.market_service import MarketService, SymbolNotFoundError


class _FakeTicker:
    def __init__(self) -> None:
        self.fast_info = {
            "last_price": 102.5,
            "previous_close": 100.0,
            "last_volume": 1_500_000,
        }
        self.news = [{"title": "AAPL mantiene tendencia alcista"}]

    def history(self, period: str, interval: str, auto_adjust: bool):
        now = datetime.now(UTC)
        index = [now - timedelta(days=1), now]
        return pd.DataFrame({"Close": [100.0, 101.8]}, index=index)


class _EmptyTicker:
    fast_info = {}
    news = []

    @staticmethod
    def history(period: str, interval: str, auto_adjust: bool):
        return pd.DataFrame()


def test_fetch_quote_success(monkeypatch):
    service = MarketService()
    monkeypatch.setattr(service, "_get_ticker", lambda symbol: _FakeTicker())

    quote = service.fetch_quote("aapl")

    assert quote.symbol == "AAPL"
    assert quote.price == 102.5
    assert quote.change == 2.5
    assert quote.volume == 1_500_000


def test_fetch_history_success(monkeypatch):
    service = MarketService()
    monkeypatch.setattr(service, "_get_ticker", lambda symbol: _FakeTicker())

    history = service.fetch_history("aapl")

    assert history.symbol == "AAPL"
    assert len(history.points) == 2


def test_fetch_quote_symbol_not_found(monkeypatch):
    service = MarketService()
    monkeypatch.setattr(service, "_get_ticker", lambda symbol: _EmptyTicker())

    with pytest.raises(SymbolNotFoundError):
        service.fetch_quote("unknown")
