import { Skeleton } from "@/components/ui/skeleton";

export default function TrackLoading() {
  return (
    <>
      <section className="border-b border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-10 w-64 max-w-full" />
          <Skeleton className="mt-3 h-5 w-full max-w-md" />
        </div>
      </section>
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <div className="rounded-2xl border border-border p-6 md:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-5 h-11 w-full rounded-md sm:w-40" />
          </div>
        </div>
      </section>
    </>
  );
}
