# TraderPulse Backend

FastAPI backend for market data, AI sentiment analysis, and gamification status.

## Stack

- Python 3.14 runtime target (Cloud Run)
- FastAPI + Uvicorn
- Pydantic Settings + python-dotenv
- yfinance for market data
- Gemini 3 Flash via `google-genai`
- Pytest + Ruff

## Features

- Health endpoint for environment and deployment checks.
- Real-time stock quote endpoint.
- Historical prices endpoint for chart rendering.
- AI sentiment endpoint in Spanish.
- Mock/in-memory gamification endpoint.
- Explicit HTTP failure propagation (no fallback fake data for market/AI services).

## API Reference

### `GET /api/v1/health`

```json
{
  "status": "active",
  "version": "1.0.0",
  "environment": "development"
}
```

### `GET /api/v1/stocks/{symbol}`

Returns current quote snapshot:

```json
{
  "symbol": "AAPL",
  "price": 202.33,
  "change": 1.45,
  "change_percent": 0.72,
  "volume": 40234232,
  "timestamp": "2026-04-19T18:20:11.240Z"
}
```

### `GET /api/v1/stocks/{symbol}/history?period=1mo&interval=1d&limit=60`

Returns historical points for charts.

### `GET /api/v1/sentiment/{symbol}`

Returns Gemini sentiment:

```json
{
  "symbol": "AAPL",
  "sentiment": "Bullish",
  "justification": "El activo mantiene momentum positivo y los titulares recientes respaldan continuidad alcista.",
  "source_model": "gemini-3.0-flash"
}
```

### `GET /api/v1/gamification/status`

Returns in-memory status:

```json
{
  "user_id": "demo-user",
  "level_name": "Especialista Cuantitativo",
  "level": 4,
  "points": 1240,
  "next_level_points": 1600,
  "progress_percent": 10.0,
  "badges": ["Explorador de Mercados", "Racha de Analisis x7", "Radar Cripto"]
}
```

## Local Development

```bash
python -m venv .venv
# activate .venv
pip install -e .[dev]
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Lint & Test

```bash
ruff check .
pytest -q
```

## Docker

Build production image:

```bash
docker build -t traderpulse-api:latest .
```

Run container:

```bash
docker run --rm -p 8080:8080 \
  -e ENVIRONMENT=production \
  -e FRONTEND_URL=https://your-app.vercel.app \
  -e GEMINI_API_KEY=your_key \
  traderpulse-api:latest
```
