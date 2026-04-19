import Image from "next/image";
import { notFound } from "next/navigation";

import {
  DestinationDetailPanel,
  TravelPlanPanel,
} from "@/components/features";
import { fetchById, fetchRelated } from "@/services/unsplash";
import type { Destination } from "@/types/travel";

interface DestinationPageProps {
  params: Promise<{ id: string }>;
}

function SimilarMosaic({ destinations }: { destinations: Destination[] }) {
  const spans = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
  ];

  return (
    <div className="p-4">
      <h2 className="mb-3 text-sm font-semibold tracking-wide uppercase">
        Destinos Similares
      </h2>
      <div className="grid max-h-[32rem] grid-cols-2 auto-rows-[86px] gap-2 overflow-hidden">
        {destinations.slice(0, 8).map((destination, index) => (
          <div
            key={destination.id}
            className={`relative overflow-hidden rounded-xl ${spans[index % spans.length]}`}
          >
            <Image
              src={destination.urls.thumb}
              alt="Destino similar"
              fill
              sizes="(max-width: 1200px) 25vw, 18vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { id } = await params;

  const destination = await fetchById(id);

  if (!destination) {
    notFound();
  }

  let relatedDestinations: Destination[] = [];

  try {
    relatedDestinations = await fetchRelated(
      destination.location || destination.cityName || "",
      destination.tags,
      destination.id,
      destination.cityName || "",
    );
  } catch {
    relatedDestinations = [];
  }

  const destinationLabel = destination.gridTitle || destination.title;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-8 md:px-6 md:py-10">
      <DestinationDetailPanel
        hero={
          <div className="relative h-full min-h-[32rem]">
            <Image
              src={destination.urls.regular}
              alt={destinationLabel}
              fill
              sizes="(max-width: 1280px) 100vw, 60vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
              <h1 className="text-2xl font-heading">{destinationLabel}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/90">
                {destination.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/35 bg-black/25 px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        }
        plan={
          <TravelPlanPanel
            destination={destinationLabel}
            context={destination.location || destination.cityName || undefined}
          />
        }
        similar={<SimilarMosaic destinations={relatedDestinations} />}
      />
    </main>
  );
}
