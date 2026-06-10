import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <>
      <section className="border-b border-border bg-background py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-4 w-28" />
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center">
            <Skeleton className="size-20 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-4 w-64 max-w-full" />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-margin-mobile md:px-margin-desktop">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </section>
    </>
  );
}
