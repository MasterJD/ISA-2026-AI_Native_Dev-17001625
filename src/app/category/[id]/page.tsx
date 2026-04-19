import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { GearGrid } from "@/components/features/GearGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryById, getInventoryByCategory } from "@/services/inventoryService";
import type { CategoryId } from "@/types/gear";

async function InventoryStream({ categoryId }: { categoryId: CategoryId }) {
  await new Promise((resolve) => {
    setTimeout(resolve, 350);
  });

  const items = await getInventoryByCategory(categoryId);
  const category = await getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return <GearGrid items={items} categoryName={category.name} />;
}

function InventoryFallback() {
  return (
    <section className="space-y-5">
      <Skeleton className="h-28 rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[370px] rounded-3xl" />
        ))}
      </div>
    </section>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
      <div className="mb-8 space-y-3">
        <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
          Volver al inicio
        </Link>
        <h1 className="font-serif text-4xl text-slate-900 md:text-5xl">{category.name}</h1>
        <p className="max-w-3xl text-sm text-slate-600 md:text-base">{category.description}</p>
      </div>

      <Suspense fallback={<InventoryFallback />}>
        <InventoryStream categoryId={category.id} />
      </Suspense>
    </main>
  );
}
