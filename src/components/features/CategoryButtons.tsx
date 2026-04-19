import Link from "next/link";

import type { CategoryDefinition } from "@/types/gear";

const categoryStyles: Record<string, string> = {
  "fotografia-video":
    "from-amber-100 via-rose-100 to-pink-100 border-rose-200/70 hover:shadow-rose-200/45",
  "montana-camping":
    "from-emerald-100 via-lime-100 to-teal-100 border-emerald-200/70 hover:shadow-emerald-200/45",
  "deportes-acuaticos":
    "from-sky-100 via-cyan-100 to-blue-100 border-sky-200/70 hover:shadow-sky-200/45",
};

interface CategoryButtonsProps {
  categories: CategoryDefinition[];
}

export function CategoryButtons({ categories }: CategoryButtonsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className={`group rounded-3xl border bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-38px] ${
            categoryStyles[category.id]
          }`}
        >
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Categoría</p>
          <h3 className="mt-2 font-serif text-2xl leading-tight text-slate-900">{category.name}</h3>
          <p className="mt-3 text-sm text-slate-700">{category.description}</p>
          <p className="mt-5 text-sm font-semibold text-slate-900">Explorar inventario</p>
        </Link>
      ))}
    </div>
  );
}
