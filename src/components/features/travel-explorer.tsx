"use client";

import { Search, Star } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ErrorAlert } from "@/components/features/error-alert";
import { MasonryGrid } from "@/components/features/masonry-grid";
import { useFavorites } from "@/components/providers/favorites-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Destination } from "@/types/travel";

function LoadingGrid() {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="mb-4 h-52 break-inside-avoid rounded-2xl bg-muted/60 animate-pulse"
        />
      ))}
    </div>
  );
}

export function TravelExplorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const queryParam = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(queryParam);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  const { favoriteIds } = useFavorites();

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      const normalized = query.trim();

      const nextParams = new URLSearchParams(searchParams.toString());
      if (normalized) {
        nextParams.set("q", normalized);
      } else {
        nextParams.delete("q");
      }

      const nextPath = nextParams.toString()
        ? `${pathname}?${nextParams.toString()}`
        : pathname;
      const currentPath = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      if (nextPath !== currentPath) {
        router.replace(nextPath as Route, { scroll: false });
      }

      setIsLoading(true);
      setError(null);

      try {
        const endpoint = normalized
          ? `/api/search?q=${encodeURIComponent(normalized)}`
          : "/api/search";
        const response = await fetch(endpoint, {
          signal: controller.signal,
          cache: "no-store",
        });

        const payload = (await response.json()) as {
          destinations?: Destination[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "No fue posible cargar destinos.");
        }

        setDestinations(payload.destinations ?? []);
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        setDestinations([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "No fue posible cargar destinos.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 260);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [pathname, query, reloadCount, router, searchParams]);

  const visibleDestinations = useMemo(() => {
    if (!onlyFavorites) {
      return destinations;
    }

    return destinations.filter((destination) => favoriteIds.includes(destination.id));
  }, [destinations, favoriteIds, onlyFavorites]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-3xl border border-border/75 bg-card/85 p-6 shadow-lg shadow-primary/10 backdrop-blur md:p-8">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          TraveLens
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-tight md:text-5xl">
          Explora destinos y crea planes inteligentes
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
          Usa las teclas de flecha para navegar entre tarjetas y presiona F para
          marcar o desmarcar favoritos.
        </p>

        <div className="relative mx-auto mt-6 w-full max-w-2xl">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar ciudad o estilo de viaje..."
            className="h-11 rounded-2xl border-border/80 bg-background/80 pl-10"
            aria-label="Buscar destinos"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {visibleDestinations.length} resultados visibles
          </p>
          <Button
            variant={onlyFavorites ? "default" : "outline"}
            onClick={() => setOnlyFavorites((current) => !current)}
            aria-pressed={onlyFavorites}
            aria-label="Alternar filtro de favoritos"
          >
            <Star className="size-4" aria-hidden="true" />
            {onlyFavorites ? "Mostrando favoritos" : "Solo favoritos"}
          </Button>
        </div>
      </section>

      {error ? (
        <ErrorAlert
          description={error}
          onRetry={() => setReloadCount((count) => count + 1)}
        />
      ) : null}

      {isLoading ? <LoadingGrid /> : <MasonryGrid destinations={visibleDestinations} />}
    </main>
  );
}
