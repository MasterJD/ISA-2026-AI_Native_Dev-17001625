"use client";

import { Award, Sparkles, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GamificationStatus } from "@/types/api";

interface GamificationSidebarProps {
  status?: GamificationStatus;
  isLoading: boolean;
}

export function GamificationSidebar({
  status,
  isLoading,
}: GamificationSidebarProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-amber-300" />
          Gamificacion
        </CardTitle>
        <CardDescription>Nivel de Inversionista y progreso de analisis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-400">Nivel de Inversionista</p>
          <p className="text-lg font-semibold text-zinc-100">
            {isLoading ? "Cargando..." : status?.level_name ?? "Sin datos"}
          </p>
          <p className="text-sm text-zinc-400">Nivel {status?.level ?? "-"}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-400">Puntos de Analisis</p>
          <p className="text-lg font-semibold text-zinc-100">
            {isLoading ? "..." : (status?.points ?? 0).toLocaleString("es-ES")}
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300 transition-all"
              style={{ width: `${status?.progress_percent ?? 0}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            {status?.progress_percent ?? 0}% hacia {status?.next_level_points ?? 0} puntos
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-400">
            <Award className="h-4 w-4" />
            Badges desbloqueados
          </p>
          <div className="flex flex-wrap gap-2">
            {(status?.badges ?? []).length > 0 ? (
              status?.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="bg-zinc-800">
                  <Sparkles className="mr-1 h-3 w-3 text-cyan-300" />
                  {badge}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-zinc-400">Aun no hay insignias disponibles.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
