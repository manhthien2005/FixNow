import { Skeleton } from "@/components/ui/skeleton";

// Group-level fallback. Only the home index lacks its own loading.tsx
// (booking/track/parts/pricing/services/contact define their own), so this
// effectively renders for the landing page.
export default function PublicLoading() {
  return (
    <>
      <section className="border-b border-border bg-background py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-5 h-14 w-full max-w-2xl" />
          <Skeleton className="mt-4 h-14 w-3/4 max-w-xl" />
          <Skeleton className="mt-6 h-5 w-full max-w-lg" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <Skeleton className="mx-auto h-9 w-64 max-w-full" />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
