"use client";

import { useEffect, useState } from "react";
import { CircleAlert, CircleCheckBig, LoaderCircle, RefreshCcw } from "lucide-react";

import { useHealthStatus } from "@/hooks/use-market-data";
import { fetchHealth, normalizeApiError } from "@/lib/api";
import type { HealthStatus } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthCardProps {
  initialHealth: HealthStatus | null;
  initialError: string | null;
}

export function HealthCard({ initialHealth, initialError }: HealthCardProps) {
  const { data, error, isLoading, mutate } = useHealthStatus(initialHealth ?? undefined);
  const [inlineError, setInlineError] = useState<string | null>(initialError);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (data) {
      setInlineError(null);
    }
  }, [data]);

  const effectiveError = inlineError ?? error?.message ?? null;

  const handleRetry = async (): Promise<void> => {
    setIsRetrying(true);
    setInlineError(null);

    try {
      const freshHealth = await fetchHealth();
      await mutate(freshHealth, false);
    } catch (retryError) {
      setInlineError(normalizeApiError(retryError).message);
    } finally {
      setIsRetrying(false);
    }
  };

  const statusVariant = effectiveError
    ? "destructive"
    : data
      ? "default"
      : "secondary";

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-lg">Estado de Conectividad</CardTitle>
          <CardDescription>
            Monitoreo de enlace entre Vercel y Cloud Run
          </CardDescription>
        </div>
        <Badge variant={statusVariant}>
          {effectiveError ? (
            <>
              <CircleAlert className="mr-1 h-3.5 w-3.5" /> Error
            </>
          ) : isLoading && !data ? (
            <>
              <LoaderCircle className="mr-1 h-3.5 w-3.5 animate-spin" /> Cargando
            </>
          ) : (
            <>
              <CircleCheckBig className="mr-1 h-3.5 w-3.5" /> Conectado
            </>
          )}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {effectiveError ? (
          <p className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-100">
            {effectiveError}
          </p>
        ) : (
          <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-zinc-400">Estado</p>
              <p className="font-semibold">{data?.status ?? "pendiente"}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-zinc-400">Version API</p>
              <p className="font-semibold">{data?.version ?? "-"}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <p className="text-zinc-400">Entorno</p>
              <p className="font-semibold">{data?.environment ?? "-"}</p>
            </div>
          </div>
        )}

        <Button variant="secondary" onClick={handleRetry} disabled={isRetrying}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          {isRetrying ? "Reintentando..." : "Reintentar"}
        </Button>
      </CardContent>
    </Card>
  );
}
