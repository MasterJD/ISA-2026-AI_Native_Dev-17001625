# Frontend Onboarding

## Quick Start

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Project Structure Deep Dive

- `src/app/layout.tsx`: Root shell, fonts, and toast provider.
- `src/app/page.tsx`: Server Component that fetches initial `/health` data.
- `src/app/globals.css`: Theme tokens and global visual language.
- `src/components/dashboard/*`: Dashboard widgets and business UI.
- `src/components/ui/*`: shadcn-style reusable primitives.
- `src/hooks/use-market-data.ts`: SWR hooks for polling API resources.
- `src/lib/env.ts`: Zod-powered env validation.
- `src/lib/api.ts`: API request layer and normalized errors.
- `src/types/api.ts`: Frontend API contracts.
- `tests/*`: Vitest suites for components and hooks.

## Common Workflows

### Add a new dashboard card

1. Create component under `src/components/dashboard`.
2. Add API contract in `src/types/api.ts`.
3. Add fetch helper in `src/lib/api.ts`.
4. Add SWR hook in `src/hooks/use-market-data.ts`.
5. Compose card in `dashboard-client.tsx`.
6. Add tests in `tests/`.

### Add a new API call

1. Add TypeScript type in `src/types/api.ts`.
2. Add typed request function in `src/lib/api.ts`.
3. Surface errors with Sonner toasts in the consuming component.
4. Add hook-level tests for success/loading/error.

### Update UI styles

1. Use design tokens from `globals.css` (HSL variables).
2. Reuse `Card`, `Badge`, `Button` before adding new primitives.
3. Keep mobile-first breakpoints and test at small widths.

## Debugging (VS Code)

Use root `.vscode/launch.json` profile:

- `Frontend: Next.js Dev`

Recommended breakpoints:

- `src/lib/api.ts` to inspect HTTP errors.
- `src/hooks/use-market-data.ts` to inspect SWR state.
- `src/components/dashboard/dashboard-client.tsx` for orchestration logic.

## Troubleshooting

- Build/start error about env vars:
  - Verify `NEXT_PUBLIC_API_URL` in `.env.local`.
- Empty dashboard data:
  - Confirm backend `http://localhost:8000/api/v1/health` is reachable.
- Repeated error toasts:
  - Check API stability and polling interval constraints.
