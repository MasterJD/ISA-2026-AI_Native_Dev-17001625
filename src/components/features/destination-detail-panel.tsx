import * as React from "react";

import { cn } from "@/lib/utils";

interface DestinationDetailPanelProps {
  hero: React.ReactNode;
  plan: React.ReactNode;
  similar: React.ReactNode;
  className?: string;
}

export function DestinationDetailPanel({
  hero,
  plan,
  similar,
  className,
}: DestinationDetailPanelProps) {
  return (
    <section
      className={cn(
        "grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)_minmax(16rem,0.9fr)]",
        className,
      )}
    >
      <div className="min-h-[32rem] overflow-hidden rounded-3xl border border-border/70 bg-card/85">
        {hero}
      </div>
      <div className="min-h-[32rem] overflow-hidden rounded-3xl border border-border/70 bg-card/85">
        {plan}
      </div>
      <aside className="min-h-[32rem] overflow-hidden rounded-3xl border border-border/70 bg-card/85">
        {similar}
      </aside>
    </section>
  );
}
