import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8 md:py-14">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <Skeleton className="h-28 rounded-3xl" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[370px] rounded-3xl" />
        ))}
      </div>
    </main>
  );
}
