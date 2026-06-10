"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";
import type { Part } from "@/db/schema";

function PartsExplorerSkeleton() {
  return (
    <div>
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
  );
}

// Defer the search/filter island; the server still fetches and serializes the
// parts, so data transfer is unchanged — only the client render is deferred.
const PartsExplorer = dynamic(
  () =>
    import("@/components/features/parts-explorer").then((m) => m.PartsExplorer),
  { ssr: false, loading: () => <PartsExplorerSkeleton /> },
);

export function PartsExplorerLazy(props: { parts: Part[] }) {
  return <PartsExplorer {...props} />;
}
