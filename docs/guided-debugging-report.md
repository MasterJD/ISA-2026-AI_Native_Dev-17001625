# Guided Debugging Report

## Reported Symptoms

Users reported:

1. Rental totals were lower than expected.
2. Rentals longer than one week were rejected.
3. The confirmation button stayed in loading state for water sports items.
4. Home page flickered with mismatch between server and client render.

## Root Causes Identified

### 1) Pricing mismatch

- File: `src/lib/date-utils.ts`
- Issue type: logical off-by-one.
- Root cause: `calculateRentalDays` omitted inclusive end date.

### 2) Rentals > 7 days blocked

- File: `src/lib/validation.ts`
- Issue type: validation constraint mismatch.
- Root cause: schema used max 7 days instead of intended max 30 days for this demo.

### 3) Permanent loading on confirm

- File: `src/components/features/RentalFlow/RentalFlow.tsx`
- Issue type: state management control flow bug.
- Root cause: early `return` after setting `isSubmitting(true)` for `deportes-acuaticos`, never entering `finally`.

### 4) Hydration mismatch and flicker

- File: `src/components/features/HeroCarousel.tsx`
- Issue type: server/client render mismatch.
- Root cause: `Math.random()` used in initial `useState`, producing different server and client first-render values.

## Fixes Applied

1. Restored inclusive day count (`differenceInCalendarDays + 1`).
2. Restored allowed rental length to 30 days.
3. Removed category-specific early return, allowing confirmation flow to complete and reset loading state.
4. Changed carousel to deterministic initial state (`0`) and moved randomization into `useEffect` after mount.

## Why the "Invisible" Flicker Happened

React hydration expects client render output to match the server HTML for the first render.
When `Math.random()` (or `new Date()`) is used directly to initialize view-critical state during render, the first client value can differ from the server value, causing hydration warnings and visible UI swaps.

## Current Status

- Price calculations are now correct.
- 7+ day rentals are accepted (up to 30 days).
- Confirm button works for all categories.
- Hydration mismatch source has been removed from the carousel initial render path.
