import { Skeleton } from "@/components/ui/skeleton";

export default function BookingSuccessLoading() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="mt-4 h-9 w-64 max-w-full" />
        <Skeleton className="mt-3 h-5 w-72 max-w-full" />
      </div>
      <div className="mt-8 rounded-2xl border border-border p-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-9 w-48" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Skeleton className="h-11 w-full rounded-md sm:w-40" />
        <Skeleton className="h-11 w-full rounded-md sm:w-40" />
      </div>
    </div>
  );
}
