import { Skeleton } from "@/components/ui/skeleton";

export default function GearLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
      <div className="mb-6 space-y-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-6">
          <Skeleton className="h-[420px] rounded-3xl" />
          <Skeleton className="h-[220px] rounded-3xl" />
        </div>
        <Skeleton className="h-[520px] rounded-3xl" />
      </div>
    </main>
  );
}
