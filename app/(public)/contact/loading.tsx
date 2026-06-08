import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <>
      <section className="border-b border-border bg-background py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-12 w-80 max-w-full" />
          <Skeleton className="mt-6 h-5 w-full max-w-xl" />
        </div>
      </section>
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto grid max-w-container-max grid-cols-1 gap-8 px-margin-mobile md:px-margin-desktop lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
            <Skeleton className="h-40 rounded-2xl" />
          </div>
          <Skeleton className="h-[460px] rounded-2xl" />
        </div>
      </section>
    </>
  );
}
