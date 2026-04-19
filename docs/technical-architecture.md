# Rent my Gear - Technical Architecture

## 1. Purpose

Rent my Gear is a premium equipment rental marketplace built with Next.js App Router.

Key goals:

- Serve images from stable `imageURL` values.
- Auto-generate missing images using Nano Banana (`gemini-3-pro-image-preview`).
- Persist generated images in Google Cloud Storage and reuse the generated public URL.
- Keep architecture easy to debug and test.

## 2. Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + shadcn-style component primitives
- Validation: Zod
- AI: Google Generative AI SDK with `gemini-3-pro-image-preview`
- Storage: Google Cloud Storage (`@google-cloud/storage`)
- Testing: Vitest + React Testing Library

## 3. High-Level Module Map

### Routing (`src/app`)

- `src/app/layout.tsx`: global shell and toast container.
- `src/app/global-error.tsx`: root error boundary.
- `src/app/page.tsx`: landing page for `/`.
- `src/app/category/[id]/*`: category inventory route with streaming fallback.
- `src/app/gear/[id]/*`: gear detail + rental flow route.
- `src/app/api/images/resolve/route.ts`: image resolution endpoint.
- `src/app/api/rentals/confirm/route.ts`: mock confirmation endpoint.

### Domain and Services

- `src/types/gear.ts`: core domain types (`GearItem`, `CategoryId`, etc.).
- `src/services/inventoryService.ts`: inventory reads, category reads, and image URL update persistence in memory.
- `src/services/imageService.ts`: image resolution strategy (existing URL -> fallback generation -> GCS upload -> URL update).
- `src/services/storageService.ts`: GCS upload/download wrapper.

### Validation and Utilities

- `src/config/env.ts`: strict server environment validation with descriptive runtime errors.
- `src/lib/validation.ts`: rental date and payload schemas.
- `src/lib/date-utils.ts`: rental range and pricing utilities.
- `src/lib/smart-insurance.ts`: category-based insurance pricing rules.

### UI Components

- `src/components/ui/*`: reusable base primitives.
- `src/components/features/*`: feature-level modules:
  - `HeroCarousel`
  - `CategoryButtons`
  - `GearGrid`
  - `RentalFlow/*`

### Data

- `src/data/inventory.json`: 50 mock items distributed across 3 categories.
- Exactly 8 items have `imageURL: null` to force fallback behavior.

## 4. Image Strategy (Core)

The system resolves images per item as follows:

1. Try current `imageURL` if present.
2. Verify source URL health with a `HEAD` request.
3. If missing or unreachable, generate a new image via Nano Banana.
4. Upload generated image to GCS via `storageService`.
5. Convert object path to public URL.
6. Persist that URL back to inventory (`updateGearImageURL`).

This keeps subsequent views stable and avoids regenerating images repeatedly.

## 5. Runtime Configuration Safety

`src/config/env.ts` validates these variables at server startup:

- `GCS_BUCKET_NAME`
- `GCS_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `NANO_BANANA_API_KEY`

If invalid or missing, the app throws a clear startup error with variable-level details.

## 6. Performance Notes

- Category inventory rendering is streamed with `Suspense`.
- Search filtering in `GearGrid` uses `useDeferredValue` to keep interactions responsive.
- Carousel uses deterministic initial render state to avoid hydration mismatch.

## 7. Testing Architecture

- Pure utility tests: `src/lib/date-utils.test.ts`
- Smart insurance tests: `src/lib/smart-insurance.test.ts`
- Rental summary rendering tests: `src/components/features/RentalFlow/PriceSummary.test.tsx`
- Integration behavior tests: `src/components/features/RentalFlow/RentalFlow.integration.test.tsx`
- Image fallback edge-case tests: `src/services/imageService.test.ts`
