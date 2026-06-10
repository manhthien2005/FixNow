"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";
import type { SavedAddress } from "@/components/features/booking-form";
import type { BookingInput } from "@/lib/validations/booking";

function BookingFormSkeleton() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border p-6 md:p-8">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="mt-2 h-4 w-64 max-w-full" />
      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        <Skeleton className="h-11 w-full rounded-md" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        <Skeleton className="h-28 w-full rounded-md" />
        <Skeleton className="h-11 w-full rounded-md md:w-48" />
      </div>
    </div>
  );
}

// Defer the heavy form island (react-hook-form + zod + date picker) until after
// the page shell paints; a skeleton holds the layout meanwhile.
const BookingForm = dynamic(
  () => import("@/components/features/booking-form").then((m) => m.BookingForm),
  { ssr: false, loading: () => <BookingFormSkeleton /> },
);

export function BookingFormLazy(props: {
  defaultValues?: Partial<BookingInput>;
  discountEligible?: boolean;
  discountPercent?: number;
  savedAddresses?: SavedAddress[];
}) {
  return <BookingForm {...props} />;
}
