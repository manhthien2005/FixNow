import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <>
      <section className="border-b border-border bg-background py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-12 w-80 max-w-full" />
          <Skeleton className="mt-6 h-5 w-full max-w-xl" />
        </div>
      </section>
      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto grid max-w-container-max grid-cols-1 gap-6 px-margin-mobile sm:grid-cols-2 md:px-margin-desktop lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </section>
    </>
  );
}
