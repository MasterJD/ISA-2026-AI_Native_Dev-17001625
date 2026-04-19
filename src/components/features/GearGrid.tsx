"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import { GearImage } from "@/components/features/GearImage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { GearItem } from "@/types/gear";

interface GearGridProps {
  items: GearItem[];
  categoryName: string;
}

export function GearGrid({ items, categoryName }: GearGridProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredItems = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    if (!normalized) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalized) ||
        item.shortDescription.toLowerCase().includes(normalized)
      );
    });
  }, [deferredQuery, items]);

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_22px_70px_-55px_rgba(15,23,42,0.75)] backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Inventario</p>
            <h2 className="mt-1 font-serif text-2xl text-slate-900">{categoryName}</h2>
          </div>
          <div className="w-full md:max-w-sm">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Buscar por nombre o descripción"
              aria-label="Buscar equipo"
            />
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600">{filteredItems.length} resultados</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <GearImage
                gearId={item.id}
                gearName={item.name}
                initialImageURL={item.imageURL}
              />
            </CardHeader>
            <CardContent className="space-y-3 pb-4">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base leading-tight">{item.name}</CardTitle>
                <Badge variant={item.availability.inStock ? "secondary" : "outline"}>
                  {item.availability.inStock ? "Disponible" : "Sin stock"}
                </Badge>
              </div>
              <p className="text-sm text-slate-600">{item.shortDescription}</p>
            </CardContent>
            <CardFooter className="justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-900">${item.dailyRate} / día</p>
              <Link
                href={`/gear/${item.id}`}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Ver detalle
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
