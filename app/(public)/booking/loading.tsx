import { Skeleton } from "@/components/ui/skeleton";

export default function BookingLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <Skeleton className="mx-auto h-9 w-56" />
        <Skeleton className="mx-auto mt-3 h-5 w-72 max-w-full" />
      </div>
      <div className="mx-auto max-w-2xl rounded-2xl border border-border p-6 md:p-8">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-2 h-4 w-64 max-w-full" />
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-28 w-full rounded-md" />
        </div>
        <Skeleton className="mt-6 h-11 w-full rounded-md md:w-48" />
      </div>
    </div>
  );
}
