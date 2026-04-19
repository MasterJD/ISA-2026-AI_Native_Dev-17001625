# Rent my Gear

Premium equipment rental marketplace built with Next.js App Router.

The project implements an image strategy centered on `imageURL` persistence:

1. Use inventory `imageURL` as the primary source.
2. If missing or unreachable, generate image with Nano Banana (`gemini-3-pro-image-preview`).
3. Persist generated image in Google Cloud Storage.
4. Save resulting public GCS URL back as the item's `imageURL`.

UI copy is in Spanish. Code and technical comments are in English.

## Core Features

- Premium home experience with featured carousel and category action buttons.
- Category inventory with real-time search and streaming UX.
- Multi-step rental flow:
  - Selection (specs + availability)
  - Date configuration with validation
  - Price summary (`dailyRate * totalDays`)
  - Mock confirmation and final confirmed state
- Global and route-specific error boundaries (`global-error`, per-route `error.tsx`).
- Strict runtime server environment validation with Zod.

## Tech Stack

- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS + shadcn-style primitives
- Zod
- Google Cloud Storage (`@google-cloud/storage`)
- Google Generative AI SDK (`@google/generative-ai`)
- Vitest + React Testing Library

## Project Structure

- `src/app`: App Router routes, global error, API routes
- `src/components/ui`: base UI primitives
- `src/components/features`: feature components (`HeroCarousel`, `CategoryButtons`, `GearGrid`, `RentalFlow`)
- `src/services`: `inventoryService`, `imageService`, `storageService`
- `src/lib`: date and validation utilities
- `src/config`: environment validation
- `src/data/inventory.json`: 50-item mock inventory
- `setup_gcs.py`: GCS setup + smoke test script

## Environment Variables

Create `.env` based on `.env.example`:

- `GCS_BUCKET_NAME`
- `GCS_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `NANO_BANANA_API_KEY`

`src/config/env.ts` validates these variables at server startup and throws a descriptive error when invalid.

## Local Setup

### 1) Install Node dependencies

```bash
npm install
```

### 2) (Optional but recommended) Install Python infra deps with uv

```bash
uv sync
```

### 3) Configure environment

```bash
copy .env.example .env
```

Then edit `.env` with your real values.

### 4) Start development server

```bash
npm run dev
```

## GCS Setup and Smoke Test

Use the provided script:

```bash
uv run setup_gcs.py
```

What it does:

1. Creates bucket if needed.
2. Enables public object access policy.
3. Uploads smoke file.
4. Verifies public URL is reachable.
5. Deletes smoke file.

## Testing

Run all tests:

```bash
npm test
```

Additional checks:

```bash
npm run lint
npm run typecheck
npm run test:coverage
```

## Documentation Index

- Technical architecture: [docs/technical-architecture.md](docs/technical-architecture.md)
- Guided debugging report: [docs/guided-debugging-report.md](docs/guided-debugging-report.md)
- Mermaid diagrams: [docs/diagrams.md](docs/diagrams.md)
- Smart Insurance feature: [docs/smart-insurance.md](docs/smart-insurance.md)
- Onboarding guide: [docs/onboarding-guide.md](docs/onboarding-guide.md)
- Testing results: [docs/testing-results.md](docs/testing-results.md)

## Notes on the "Invisible" UI Flicker

Hydration mismatch was traced to dynamic values used in initial render state (`Math.random()` in `HeroCarousel`).
The fix makes initial server/client render deterministic and applies randomization only after mount (`useEffect`).

## Mock Inventory Data

- 50 total items across:
  - Fotografía y Video
  - Montaña y Camping
  - Deportes Acuáticos
- 8 items intentionally start without `imageURL` to force fallback generation flow.
