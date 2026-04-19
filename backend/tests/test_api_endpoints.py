from datetime import UTC, datetime

from app.api.v1 import routes
from app.models.schemas import SentimentResponse, StockQuoteResponse
from app.services.market_service import SymbolNotFoundError


class _FakeAIService:
    @staticmethod
    def analyze_sentiment(symbol, quote, headlines):
        return SentimentResponse(
            symbol=symbol.upper(),
            sentiment="Bullish",
            justification="La presion compradora domina y el flujo de noticias favorece al activo.",
            source_model="gemini-3.0-flash",
        )


def _raise(exc: Exception):
    raise exc


def test_stock_endpoint_success(client, monkeypatch):
    quote = StockQuoteResponse(
        symbol="AAPL",
        price=200.2,
        change=2.2,
        change_percent=1.11,
        volume=999,
        timestamp=datetime.now(UTC),
    )
    monkeypatch.setattr(routes.market_service, "fetch_quote", lambda symbol: quote)

    response = client.get("/api/v1/stocks/AAPL")

    assert response.status_code == 200
    assert response.json()["symbol"] == "AAPL"


def test_stock_endpoint_not_found(client, monkeypatch):
    monkeypatch.setattr(
        routes.market_service,
        "fetch_quote",
        lambda symbol: _raise(SymbolNotFoundError("Stock symbol 'MISS' was not found.")),
    )

    response = client.get("/api/v1/stocks/MISS")

    assert response.status_code == 404


def test_sentiment_endpoint_success(client, app, monkeypatch):
    quote = StockQuoteResponse(
        symbol="TSLA",
        price=180.0,
        change=-1.2,
        change_percent=-0.66,
        volume=1000,
        timestamp=datetime.now(UTC),
    )

    monkeypatch.setattr(routes.market_service, "fetch_quote", lambda symbol: quote)
    monkeypatch.setattr(
        routes.market_service,
        "fetch_recent_headlines",
        lambda symbol: ["TSLA muestra consolidacion despues de resultados"],
    )

    app.dependency_overrides[routes.get_ai_service] = lambda: _FakeAIService()
    response = client.get("/api/v1/sentiment/TSLA")
    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["sentiment"] == "Bullish"


def test_gamification_status_contract(client):
    response = client.get("/api/v1/gamification/status")

    assert response.status_code == 200
    payload = response.json()
    assert "points" in payload
    assert "badges" in payload
