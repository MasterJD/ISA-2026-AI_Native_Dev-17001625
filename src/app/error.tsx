"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-3xl">Algo salio mal</h1>
      <p className="text-sm text-muted-foreground">
        Ocurrio un error inesperado. Puedes intentar de nuevo.
      </p>
      <Button onClick={reset} aria-label="Intentar nuevamente">
        Reintentar
      </Button>
    </main>
  );
}
