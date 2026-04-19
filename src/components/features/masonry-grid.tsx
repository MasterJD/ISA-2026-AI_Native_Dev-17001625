"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import {
  type KeyboardEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Destination } from "@/types/travel";
import { useFavorites } from "@/components/providers/favorites-provider";
import { cn } from "@/lib/utils";

interface MasonryGridProps {
  destinations: Destination[];
  className?: string;
}

export function MasonryGrid({ destinations, className }: MasonryGridProps) {
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();

  const destinationIds = useMemo(
    () => destinations.map((destination) => destination.id),
    [destinations],
  );

  if (destinations.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center text-sm text-muted-foreground">
        No se encontraron destinos.
      </div>
    );
  }

  function clampIndex(index: number): number {
    if (index < 0) {
      return 0;
    }

    if (index >= destinations.length) {
      return destinations.length - 1;
    }

    return index;
  }

  function focusIndex(index: number) {
    const nextIndex = clampIndex(index);
    const node = itemRefs.current[nextIndex];

    if (!node) {
      return;
    }

    setActiveIndex(nextIndex);
    node.focus();
  }

  function onGridKeyDown(event: KeyboardEvent<HTMLElement>) {
    const key = event.key;

    if (key === "ArrowRight" || key === "ArrowDown") {
      event.preventDefault();
      focusIndex(activeIndex + 1);
      return;
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      event.preventDefault();
      focusIndex(activeIndex - 1);
      return;
    }

    if (key.toLowerCase() === "f") {
      const focusedId = destinationIds[activeIndex];
      if (focusedId) {
        event.preventDefault();
        toggleFavorite(focusedId);
      }
    }
  }

  return (
    <section
      className={cn("columns-1 gap-4 sm:columns-2 lg:columns-3", className)}
      role="grid"
      aria-label="Cuadricula de destinos"
      onKeyDown={onGridKeyDown}
    >
      {destinations.map((destination, index) => (
        <article
          key={destination.id}
          className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-2xl border border-border/60 bg-card/80"
          role="gridcell"
        >
          <Link
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            href={`/destination/${destination.id}`}
            className="block outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onFocus={() => {
              setActiveIndex(index);
            }}
            aria-label={`Abrir destino ${destination.gridTitle || destination.title}`}
          >
            <Image
              src={destination.urls.small}
              alt={destination.gridTitle || destination.title}
              width={900}
              height={1300}
              className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <h3 className="line-clamp-1 text-sm font-semibold tracking-wide">
                {destination.gridTitle || destination.title}
              </h3>
              <p className="line-clamp-2 text-xs text-white/85">
                {destination.gridSubtitle || destination.description}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => toggleFavorite(destination.id)}
            aria-pressed={isFavorite(destination.id)}
            aria-label={
              isFavorite(destination.id)
                ? "Quitar de favoritos"
                : "Agregar a favoritos"
            }
            className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur transition hover:bg-black/55 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Heart
              className={cn(
                "size-4",
                isFavorite(destination.id) ? "fill-current" : "fill-transparent",
              )}
              aria-hidden="true"
            />
          </button>
        </article>
      ))}
    </section>
  );
}
