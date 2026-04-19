import {
  normalizeFavoriteIds,
  parseFavoritesPayload,
  toggleFavoriteId,
} from "@/lib/favorites";
import { describe, expect, it } from "vitest";

describe("favorites helpers", () => {
  it("normalizes and deduplicates ids", () => {
    expect(normalizeFavoriteIds([" a ", "b", "a", "", "  "])).toEqual([
      "a",
      "b",
    ]);
  });

  it("toggles ids on and off", () => {
    const withFavorite = toggleFavoriteId(["rome"], "paris");
    expect(withFavorite).toEqual(["rome", "paris"]);

    const withoutFavorite = toggleFavoriteId(withFavorite, "rome");
    expect(withoutFavorite).toEqual(["paris"]);
  });

  it("returns empty array for invalid serialized payload", () => {
    expect(parseFavoritesPayload("not-json")).toEqual([]);
    expect(parseFavoritesPayload("{\"bad\":true}")).toEqual([]);
  });
});
