import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentDetailLoading() {
  return (
    <>
      <section className="border-b border-white/5 bg-background py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-4 w-40" />
          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-10 w-56" />
            </div>
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
      </section>
      <section className="bg-background py-10 md:py-14">
        <div className="mx-auto max-w-3xl space-y-6 px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-32 rounded-2xl" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </section>
    </>
  );
}
