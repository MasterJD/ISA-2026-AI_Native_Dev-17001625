import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-14 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-3xl" />
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[1.35fr_1fr]">
        <Skeleton className="h-[320px] w-full rounded-3xl" />
        <Skeleton className="h-[320px] w-full rounded-3xl" />
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
    </main>
  );
}
