"use client";

import { FavoritesProvider } from "@/components/providers/favorites-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}
