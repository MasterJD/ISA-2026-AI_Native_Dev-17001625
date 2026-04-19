# Onboarding Guide

## 1. Local Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Python 3.10+ (for infrastructure script)
- uv (for Python dependency management)

### Install

```bash
npm install
uv sync
```

### Environment

Create `.env` from `.env.example` and set:

- `GCS_BUCKET_NAME`
- `GCS_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `NANO_BANANA_API_KEY`

### Run

```bash
npm run dev
```

## 2. Architecture Orientation

### Main entry points

- Home: `src/app/(home)/page.tsx`
- Category view: `src/app/category/[id]/page.tsx`
- Gear detail + rental flow: `src/app/gear/[id]/page.tsx`

### Service layer

- `src/services/inventoryService.ts`
- `src/services/imageService.ts`
- `src/services/storageService.ts`

### Validation and shared logic

- `src/config/env.ts`
- `src/lib/validation.ts`
- `src/lib/date-utils.ts`

## 3. Debugging GCS Connection

### Fast path

Run:

```bash
uv run setup_gcs.py
```

Expected outcomes:

1. Bucket exists or is created.
2. Public read IAM is configured.
3. Smoke object upload succeeds.
4. Public URL returns HTTP 200.
5. Smoke object is deleted.

### If setup fails

1. Verify service account key path in `GOOGLE_APPLICATION_CREDENTIALS`.
2. Ensure service account has bucket create/object admin permissions.
3. Ensure the project id is correct and billing is active.
4. Re-run setup script and inspect exact exception message.

### Runtime image fallback checks

1. Pick a gear item with missing image.
2. Open developer tools network tab.
3. Confirm request to `/api/images/resolve`.
4. Confirm response includes `source: "nano-banana"` and a `storage.googleapis.com` URL.

## 4. How to Add a New Category Safely

To add a category without breaking validation:

1. Add new category id to `CategoryId` in `src/types/gear.ts`.
2. Add category metadata in `categoryDefinitions` inside `src/services/inventoryService.ts`.
3. Add the same category id to `rentalRequestSchema` enum in `src/lib/validation.ts`.
4. Add gear records in `src/data/inventory.json` using the new `categoryId`.
5. Add visual style mapping in `src/components/features/CategoryButtons.tsx`.
6. Add/adjust tests for the new category paths in integration tests.

If any of these steps are skipped, runtime and validation drift can occur.

## 5. Testing Commands

```bash
npm test
npm run lint
npm run typecheck
```
