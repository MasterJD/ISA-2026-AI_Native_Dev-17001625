"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="es">
      <body className="min-h-screen bg-slate-900 text-white">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-serif text-4xl">Algo salió mal</h1>
          <p className="text-sm text-slate-300">
            Ocurrió un error no controlado. Puedes intentar nuevamente.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900"
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
