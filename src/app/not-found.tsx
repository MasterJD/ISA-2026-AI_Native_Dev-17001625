import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-4xl text-slate-900">Recurso no encontrado</h1>
      <p className="text-sm text-slate-600">El equipo o categoría solicitada no existe.</p>
      <Button asChild>
        <Link href="/">Ir a inicio</Link>
      </Button>
    </main>
  );
}
