import { Suspense } from "react";

import { TravelExplorer } from "@/components/features";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-8 md:px-6 md:py-10">
          <div className="h-32 rounded-3xl bg-muted/60 animate-pulse" />
          <div className="h-60 rounded-3xl bg-muted/60 animate-pulse" />
        </main>
      }
    >
      <TravelExplorer />
    </Suspense>
  );
}
