"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { GearImage } from "@/components/features/GearImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { GearItem } from "@/types/gear";

interface HeroCarouselProps {
  items: GearItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const safeItems = useMemo(() => items.slice(0, 5), [items]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (safeItems.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeItems.length);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [safeItems.length]);

  if (!safeItems.length) {
    return null;
  }

  const item = safeItems[activeIndex];

  return (
    <Card className="overflow-hidden border-none bg-transparent shadow-none">
      <CardContent className="grid gap-6 px-0 md:grid-cols-[1.35fr_1fr]">
        <GearImage
          gearId={item.id}
          gearName={item.name}
          initialImageURL={item.imageURL}
          className="h-[320px] md:h-[380px]"
        />
        <div className="flex flex-col justify-between rounded-3xl bg-white/70 p-6 shadow-[0_22px_65px_-40px_rgba(15,23,42,0.65)] backdrop-blur">
          <div className="space-y-4">
            <Badge variant="secondary">Equipo destacado</Badge>
            <h2 className="font-serif text-3xl leading-tight text-slate-900">{item.name}</h2>
            <p className="text-sm leading-relaxed text-slate-600">{item.shortDescription}</p>
            <p className="text-sm font-semibold text-slate-800">
              Desde ${item.dailyRate} / día
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {safeItems.map((dotItem, index) => (
                <button
                  key={dotItem.id}
                  type="button"
                  aria-label={`Ir al item ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIndex === index ? "w-8 bg-slate-900" : "w-2.5 bg-slate-300"
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <Button asChild>
              <Link href={`/gear/${item.id}`}>Rentar ahora</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
