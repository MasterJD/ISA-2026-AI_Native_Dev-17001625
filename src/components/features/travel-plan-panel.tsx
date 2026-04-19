"use client";

import { useCallback, useEffect, useState } from "react";

import { ErrorAlert } from "@/components/features/error-alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TravelPlan } from "@/types/travel";

interface TravelPlanPanelProps {
  destination: string;
  context?: string;
}

export function TravelPlanPanel({ destination, context }: TravelPlanPanelProps) {
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  const loadPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination, context }),
      });

      const payload = (await response.json()) as {
        plan?: TravelPlan;
        error?: string;
      };

      if (!response.ok || !payload.plan) {
        throw new Error(payload.error || "No fue posible generar el plan.");
      }

      setPlan(payload.plan);
    } catch (loadError) {
      setPlan(null);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No fue posible generar el plan.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [context, destination]);

  // REVIEWER_NOTE: This effect intentionally triggers the client-side API call.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPlan();
  }, [loadPlan, reloadCount]);

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorAlert
          title="No pudimos cargar el plan"
          description={error}
          onRetry={() => setReloadCount((count) => count + 1)}
        />
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="space-y-3 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Plan sugerido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{plan.intro}</p>
        </CardContent>
      </Card>

      {plan.days.map((day) => (
        <Card key={day.day}>
          <CardHeader>
            <CardTitle className="text-base">Dia {day.day}: {day.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {day.activities.map((activity) => (
                <li key={activity}>- {activity}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="space-y-2 pt-4">
          <Badge variant="secondary">Hidden Gem</Badge>
          <p className="text-sm font-medium">{plan.hiddenGem.title}</p>
          <p className="text-sm text-muted-foreground">{plan.hiddenGem.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 pt-4">
          <Badge variant="secondary">Local Food</Badge>
          <p className="text-sm font-medium">{plan.localFood.dish}</p>
          <p className="text-sm text-muted-foreground">{plan.localFood.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
