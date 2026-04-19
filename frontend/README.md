# TraderPulse Frontend

Next.js 16 dashboard for TraderPulse, focused on real-time visualization and AI-driven market insights.

## Stack

- Next.js 16 (App Router)
- React Server Components + Client Components
- Tailwind CSS + shadcn/ui primitives
- Lucide React icons
- SWR for polling/caching
- Recharts for market trend visualization
- Sonner for toast notifications
- Zod environment validation
- Vitest + React Testing Library

## UI Modules

- `DashboardClient`: Main orchestration and page-level state.
- `TickerTape`: Clickable ticker selector.
- `MarketOverview`: Price cards + Recharts line chart.
- `SentimentWidget`: Gemini sentiment card with color indicators.
- `GamificationSidebar`: XP, level, progress bar, and badges.
- `HealthCard`: Frontend-backend connectivity status with retry action.
- `WatchlistGrid`: Cards for tracked assets.

## Component Libraries

- **shadcn/ui style primitives**: `Card`, `Badge`, `Button` (local components).
- **Lucide React**: Visual language for statuses and market cues.
- **Recharts**: Lightweight SVG charts with responsive container.
- **Sonner**: User-friendly error surfacing from API failures.

## Environment Validation

`src/lib/env.ts` validates `NEXT_PUBLIC_API_URL` using Zod at startup/build.

Expected value:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Local Development

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Lint, Typecheck, Test

```bash
npm run lint
npm run typecheck
npm run test
```
