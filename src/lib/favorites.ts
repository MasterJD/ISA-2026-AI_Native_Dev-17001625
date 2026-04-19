export const FAVORITES_STORAGE_KEY = "travelens.favorites";

export function normalizeFavoriteIds(ids: string[]): string[] {
  return Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));
}

export function toggleFavoriteId(ids: string[], id: string): string[] {
  const normalizedId = id.trim();
  if (!normalizedId) {
    return normalizeFavoriteIds(ids);
  }

  if (ids.includes(normalizedId)) {
    return ids.filter((existingId) => existingId !== normalizedId);
  }

  return normalizeFavoriteIds([...ids, normalizedId]);
}

export function parseFavoritesPayload(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return normalizeFavoriteIds(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return [];
  }
}

export function readFavorites(storage?: Storage): string[] {
  if (!storage) {
    return [];
  }

  return parseFavoritesPayload(storage.getItem(FAVORITES_STORAGE_KEY));
}

export function writeFavorites(ids: string[], storage?: Storage): void {
  if (!storage) {
    return;
  }

  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalizeFavoriteIds(ids)));
}
