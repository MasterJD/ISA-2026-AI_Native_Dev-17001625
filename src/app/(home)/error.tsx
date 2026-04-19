"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="font-serif text-3xl text-slate-900">No pudimos cargar la página principal</h2>
      <p className="text-sm text-slate-600">Intenta recargar para continuar.</p>
      <Button onClick={reset}>Reintentar</Button>
    </main>
  );
}
