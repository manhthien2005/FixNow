import { Skeleton } from "@/components/ui/skeleton";

export default function PartsLoading() {
  return (
    <>
      <section className="border-b border-white/5 bg-background py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-12 w-72 max-w-full" />
          <Skeleton className="mt-6 h-5 w-full max-w-xl" />
        </div>
      </section>
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-11 w-full max-w-md rounded-xl" />
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
