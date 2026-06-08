import { Skeleton } from "@/components/ui/skeleton";

export default function MyAppointmentsLoading() {
  return (
    <>
      <section className="border-b border-border bg-background py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-10 w-72 max-w-full" />
          <Skeleton className="mt-3 h-5 w-full max-w-md" />
          <div className="mt-8 flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
