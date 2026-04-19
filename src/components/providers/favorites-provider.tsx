"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  readFavorites,
  toggleFavoriteId,
  writeFavorites,
} from "@/lib/favorites";

interface FavoritesContextValue {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FALLBACK_FAVORITES_CONTEXT: FavoritesContextValue = {
  favoriteIds: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
};

const FavoritesContext = createContext<FavoritesContextValue>(
  FALLBACK_FAVORITES_CONTEXT,
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readFavorites(window.localStorage),
  );

  useEffect(() => {
    writeFavorites(favoriteIds, window.localStorage);
  }, [favoriteIds]);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((current) => toggleFavoriteId(current, id));
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds],
  );

  const value = useMemo(
    () => ({ favoriteIds, toggleFavorite, isFavorite }),
    [favoriteIds, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  return useContext(FavoritesContext);
}
