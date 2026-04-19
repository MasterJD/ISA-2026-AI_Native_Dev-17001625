import Link from "next/link";

import { CategoryButtons } from "@/components/features/CategoryButtons";
import { HeroCarousel } from "@/components/features/HeroCarousel";
import { getCategories, getRandomFeaturedItems } from "@/services/inventoryService";

export default async function HomePage() {
  const [categories, featuredItems] = await Promise.all([
    getCategories(),
    getRandomFeaturedItems(5),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rent my Gear</p>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight text-slate-900 md:text-6xl">
            Renta equipo premium para tu próxima aventura
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 md:text-base">
            Marketplace especializado en fotografía, montaña y deportes acuáticos con flujo de renta guiado y disponibilidad en tiempo real.
          </p>
        </div>
        <HeroCarousel items={featuredItems} />
      </section>

      <section className="mt-12 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-3xl text-slate-900">Explora por categoría</h2>
          <Link
            href="/category/fotografia-video"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Ver inventario
          </Link>
        </div>
        <CategoryButtons categories={categories} />
      </section>
    </main>
  );
}