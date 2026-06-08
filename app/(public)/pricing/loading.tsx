import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <>
      <section className="border-b border-white/5 bg-background py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-12 w-80 max-w-full" />
          <Skeleton className="mt-6 h-5 w-full max-w-xl" />
          <Skeleton className="mt-8 h-16 w-full max-w-3xl rounded-2xl" />
        </div>
      </section>
      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto max-w-container-max space-y-14 px-margin-mobile md:px-margin-desktop">
          {Array.from({ length: 3 }).map((_, g) => (
            <div key={g}>
              <div className="mb-6 flex items-center gap-4">
                <Skeleton className="size-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
