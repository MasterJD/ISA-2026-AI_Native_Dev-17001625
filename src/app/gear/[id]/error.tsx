"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GearError({
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
      <h2 className="font-serif text-3xl text-slate-900">No pudimos cargar este equipo</h2>
      <p className="text-sm text-slate-600">Es posible que el item ya no esté disponible.</p>
      <Button onClick={reset}>Reintentar</Button>
    </main>
  );
}
