import Image from "next/image";
import Link from "next/link";

import type { Destination } from "@/services/unsplash";
import { cn } from "@/lib/utils";

interface MasonryGridProps {
  destinations: Destination[];
  className?: string;
}

export function MasonryGrid({ destinations, className }: MasonryGridProps) {
  if (destinations.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/80 p-8 text-center text-sm text-muted-foreground">
        No destinations found.
      </div>
    );
  }

  return (
    <section className={cn("columns-1 gap-4 sm:columns-2 lg:columns-3", className)}>
      {destinations.map((destination) => (
        <Link
          key={destination.id}
          href={`/destination/${destination.id}`}
          className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-2xl border border-border/60 bg-card/80"
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
      ))}
    </section>
  );
}
