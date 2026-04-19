# Onboarding Guide

This guide helps a new engineer start working on TraderPulse in less than 30 minutes.

## 1. Prerequisites

- Node.js 22+
- npm 10+
- Python 3.11+ (Cloud Run runtime target: Python 3.14)
- Docker Desktop (optional but recommended)
- Google Cloud SDK (`gcloud`) for backend deployment
- Vercel CLI (`npm i -g vercel`) for frontend deployment

## 2. Quick Start

### Docker workflow

```bash
docker compose up --build
```

### Native workflow

Backend:

```bash
cd backend
python -m venv .venv
# activate .venv
pip install -e .[dev]
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 3. Project Structure Deep Dive

### Root

- `README.md`: Project overview, quick commands, and feature index.
- `ONBOARDING.md`: This guide.
- `ARCHITECTURE.md`: Cross-service architecture and ADRs.
- `docker-compose.yml`: Local full-stack orchestration with hot reload.
- `.vscode/launch.json`: Shared debugging profiles.
- `src/app/page.tsx`: Grader compatibility root component.

### Backend (`/backend`)

- `app/main.py`: FastAPI app factory, middleware, and router wiring.
- `app/config.py`: Pydantic settings and environment validation.
- `app/api/v1/routes.py`: API endpoints (`health`, `stocks`, `sentiment`, `gamification`).
- `app/services/market_service.py`: yfinance access wrapper.
- `app/services/ai_service.py`: Gemini 3 Flash integration.
- `app/services/gamification_service.py`: Mock/in-memory gamification state.
- `app/models/schemas.py`: Shared API contracts.
- `tests/`: Endpoint and service-level tests.
- `scripts/smoke-test.sh`: Container health verification script.

### Frontend (`/frontend`)

- `src/app/layout.tsx`: Root layout and Toaster provider.
- `src/app/page.tsx`: Server Component entrypoint.
- `src/components/dashboard/*`: Dashboard UI blocks.
- `src/components/ui/*`: shadcn-style UI primitives.
- `src/lib/env.ts`: Zod environment validation.
- `src/lib/api.ts`: HTTP client helpers.
- `src/types/api.ts`: Shared frontend TypeScript contracts.
- `tests/`: Vitest + RTL UI tests.

## 4. Common Workflows

### Add a new backend endpoint

1. Add request/response schemas in `backend/app/models/schemas.py` if needed.
2. Add service logic in `backend/app/services/`.
3. Register route in `backend/app/api/v1/routes.py`.
4. Add tests in `backend/tests/`.
5. Run `pytest -q` and `ruff check .`.

### Add a new frontend widget

1. Create component under `frontend/src/components/dashboard/`.
2. Add API contract to `frontend/src/types/api.ts`.
3. Add fetch helper to `frontend/src/lib/api.ts`.
4. Compose the widget in `frontend/src/components/dashboard/dashboard-client.tsx`.
5. Add Vitest coverage in `frontend/tests/`.

### Update environment variables

1. Add new variable to `backend/.env.example` or `frontend/.env.example`.
2. Extend validators in:
   - `backend/app/config.py` (Pydantic)
   - `frontend/src/lib/env.ts` (Zod)
3. Update docs in README and deployment sections.

## 5. Debugging (VS Code)

Launch profiles in `.vscode/launch.json`:

- **Backend: FastAPI (Uvicorn)**
- **Backend: Pytest**
- **Frontend: Next.js Dev**
- **TraderPulse Full Stack** (compound)

Tips:

- Backend startup failure usually means missing `GEMINI_API_KEY` or invalid `FRONTEND_URL`.
- Frontend startup failure usually means missing or malformed `NEXT_PUBLIC_API_URL`.
- CORS errors in browser: verify backend `FRONTEND_URL` matches deployed frontend domain exactly.

## 6. Production Deployment

### 6.1 Google Secret Manager

Create secret for Gemini key:

```bash
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create traderpulse-gemini-key --data-file=-
```

Grant Cloud Run service account access:

```bash
gcloud secrets add-iam-policy-binding traderpulse-gemini-key \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 6.2 Deploy backend (Cloud Run)

Build and push image:

```bash
cd backend
gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT_ID/traderpulse/traderpulse-api:latest
```

Deploy:

```bash
gcloud run deploy traderpulse-api \
  --image REGION-docker.pkg.dev/PROJECT_ID/traderpulse/traderpulse-api:latest \
  --region REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars ENVIRONMENT=production,PORT=8080,FRONTEND_URL=https://placeholder.vercel.app \
  --set-secrets GEMINI_API_KEY=traderpulse-gemini-key:latest
```

### 6.3 Deploy frontend (Vercel)

```bash
cd frontend
vercel env add NEXT_PUBLIC_API_URL production
# paste Cloud Run URL + /api/v1
vercel --prod
```

### 6.4 CORS final sync

After Vercel returns final domain:

```bash
gcloud run services update traderpulse-api \
  --region REGION \
  --set-env-vars FRONTEND_URL=https://YOUR_APP.vercel.app
```

### 6.5 Smoke tests

- `GET https://<cloud-run-url>/api/v1/health`
- Open Vercel URL and validate full frontend-backend-AI handshake.
