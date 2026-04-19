"use client";

import { Search, Sparkles, Star } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

import { ErrorAlert } from "@/components/features/error-alert";
import { MasonryGrid } from "@/components/features/masonry-grid";
import { useFavorites } from "@/components/providers/favorites-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_DESTINATIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
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
  const [activeView, setActiveView] = useState<"explorar" | "favoritos" | "itinerario">("explorar");
  const [query, setQuery] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>(
    MOCK_DESTINATIONS.slice(0, 12),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  const { favoriteIds } = useFavorites();

  function filterMockDestinations(searchValue: string): Destination[] {
    const normalized = searchValue.trim().toLowerCase();
    if (!normalized) {
      return MOCK_DESTINATIONS.slice(0, 12);
    }

    return MOCK_DESTINATIONS.filter((destination) => {
      const searchableText = [
        destination.title,
        destination.description,
        destination.gridTitle,
        destination.gridSubtitle,
        destination.cityName,
        destination.location,
        ...destination.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalized);
    }).slice(0, 12);
  }

  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get("q") ?? "";
    if (initialQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Query is only available from browser URL after hydration.
      setQuery(initialQuery);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      const normalized = query.trim();

      const nextParams = new URLSearchParams(window.location.search);
      if (normalized) {
        nextParams.set("q", normalized);
      } else {
        nextParams.delete("q");
      }

      const nextPath = nextParams.toString()
        ? `${window.location.pathname}?${nextParams.toString()}`
        : window.location.pathname;
      const currentPath = `${window.location.pathname}${window.location.search}`;

      if (nextPath !== currentPath) {
        window.history.replaceState({}, "", nextPath);
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

        const apiDestinations = payload.destinations ?? [];
        setDestinations(
          apiDestinations.length > 0
            ? apiDestinations
            : filterMockDestinations(normalized),
        );
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        setDestinations(filterMockDestinations(normalized));
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
  }, [query, reloadCount]);

  const visibleDestinations = useMemo(() => {
    if (activeView !== "favoritos") {
      return destinations;
    }

    return destinations.filter((destination) => favoriteIds.includes(destination.id));
  }, [activeView, destinations, favoriteIds]);

  const highlightedDestinations = visibleDestinations.slice(0, 3);

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
          <nav
            className="inline-flex rounded-xl border border-border/70 bg-background/70 p-1"
            aria-label="Navegacion principal"
          >
            <Button
              size="sm"
              variant={activeView === "explorar" ? "default" : "ghost"}
              aria-selected={activeView === "explorar"}
              onClick={() => setActiveView("explorar")}
            >
              Explorar
            </Button>
            <Button
              size="sm"
              variant={activeView === "favoritos" ? "default" : "ghost"}
              aria-selected={activeView === "favoritos"}
              onClick={() => setActiveView("favoritos")}
            >
              <Star className="size-4" aria-hidden="true" /> Favoritos
            </Button>
            <Button
              size="sm"
              variant={activeView === "itinerario" ? "default" : "ghost"}
              aria-selected={activeView === "itinerario"}
              onClick={() => setActiveView("itinerario")}
            >
              Itinerario
            </Button>
          </nav>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          Destinos destacados: {highlightedDestinations.map((item) => item.gridTitle).join(", ")}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div>
          {error ? (
            <div className="mb-4">
              <ErrorAlert
                description={error}
                onRetry={() => setReloadCount((count) => count + 1)}
              />
            </div>
          ) : null}

          {isLoading ? <LoadingGrid /> : <MasonryGrid destinations={visibleDestinations} />}
        </div>

        <aside className="rounded-3xl border border-border/75 bg-card/85 p-5 shadow-lg shadow-primary/10 backdrop-blur">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            AI Planner
          </p>
          <h2 className="mt-2 font-heading text-2xl">Itinerario IA</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Genera un plan optimizado con ritmo diario, joyas ocultas y recomendaciones locales.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Dia 1: Llegada y exploracion contextual.</li>
            <li>Dia 2: Ruta cultural y gastronomia local.</li>
            <li>Dia 3: Cierre relajado con spot fotografico.</li>
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button aria-label="Generar plan IA" className="gap-2">
              <Sparkles className="size-4" aria-hidden="true" />
              Generar plan IA
            </Button>
            {visibleDestinations[0] ? (
              <Link
                href={`/destination/${visibleDestinations[0].id}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Ver detalle
              </Link>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
