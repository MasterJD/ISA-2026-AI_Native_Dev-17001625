import Link from "next/link";
import { notFound } from "next/navigation";

import { GearImage } from "@/components/features/GearImage";
import { RentalFlow } from "@/components/features/RentalFlow";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getGearById } from "@/services/inventoryService";

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getGearById(id);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
      <div className="mb-6 space-y-3">
        <Link href={`/category/${item.categoryId}`} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
          Volver a {item.categoryName}
        </Link>
        <h1 className="font-serif text-4xl text-slate-900 md:text-5xl">{item.name}</h1>
        <p className="max-w-3xl text-sm text-slate-600 md:text-base">{item.shortDescription}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section className="space-y-6">
          <GearImage
            gearId={item.id}
            gearName={item.name}
            initialImageURL={item.imageURL}
            className="h-[340px] md:h-[420px]"
          />

          <Card>
            <CardContent className="space-y-4 py-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-slate-900">Especificaciones técnicas</h2>
                <Badge variant={item.availability.inStock ? "secondary" : "outline"}>
                  {item.availability.inStock ? "Disponible" : "Sin stock"}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(item.technicalSpecs).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{key}</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <RentalFlow item={item} />
        </section>
      </div>
    </main>
  );
}
