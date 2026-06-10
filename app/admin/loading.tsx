import { Skeleton } from "@/components/ui/skeleton";

// Shared fallback for every admin route (dashboard, appointments, parts,
// services, verifications, detail) — they render inside the admin topbar layout.
export default function AdminLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="mt-8 space-y-3">
        <Skeleton className="h-11 w-full rounded-xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
