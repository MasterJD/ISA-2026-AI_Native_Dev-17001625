# Backend Onboarding

## Quick Start

```bash
cd backend
python -m venv .venv
# activate .venv
pip install -e .[dev]
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Project Structure Deep Dive

- `app/main.py`: App factory, CORS setup, router mounting.
- `app/config.py`: Environment validation via Pydantic Settings.
- `app/api/v1/routes.py`: Versioned HTTP contracts.
- `app/services/market_service.py`: Market quote/history/headline retrieval.
- `app/services/ai_service.py`: Gemini sentiment orchestration.
- `app/services/gamification_service.py`: In-memory user progress logic.
- `app/models/schemas.py`: Pydantic response contracts.
- `tests/`: Unit + API contract tests.
- `scripts/smoke-test.sh`: Container readiness validation.

## Common Workflows

### Add a new endpoint

1. Add response/request schema in `app/models/schemas.py`.
2. Create service logic in `app/services`.
3. Register endpoint in `app/api/v1/routes.py`.
4. Add tests in `tests/`.
5. Run `ruff check .` and `pytest -q`.

### Add a new upstream provider

1. Isolate provider client in `app/services`.
2. Define provider-specific exceptions and map them to HTTP errors in routes.
3. Add env var in `app/config.py` and `.env.example`.
4. Update deployment docs for Secret Manager if credentials are required.

### Tighten CORS rules

1. Update `FRONTEND_URL` in environment.
2. Review logic in `_build_allowed_origins` (`app/main.py`).
3. Validate from browser with origin-specific requests.

## Debugging (VS Code)

Use root `.vscode/launch.json`:

- `Backend: FastAPI (Uvicorn)`
- `Backend: Pytest`

Recommended breakpoints:

- `app/api/v1/routes.py`: HTTP boundary and error mapping.
- `app/services/market_service.py`: yfinance data translation.
- `app/services/ai_service.py`: Gemini JSON parsing.

## Troubleshooting

- `422/500` on startup:
  - Check `.env` values and required keys (`FRONTEND_URL`, `GEMINI_API_KEY`).
- CORS blocked:
  - Verify exact `FRONTEND_URL` scheme/domain.
- Sentiment endpoint failing:
  - Validate `GEMINI_API_KEY` and outbound internet access from runtime.
