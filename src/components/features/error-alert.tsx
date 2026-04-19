import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorAlert({
  title = "Ocurrio un error",
  description,
  onRetry,
}: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-destructive"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm text-destructive/90">{description}</p>
        </div>
        {onRetry ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            aria-label="Reintentar carga"
          >
            Reintentar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
