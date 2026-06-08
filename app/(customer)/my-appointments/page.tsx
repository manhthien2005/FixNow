import Link from "next/link";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, CalendarPlus, CalendarX } from "lucide-react";

import { db } from "@/db";
import { appointments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { GridBackdrop } from "@/components/marketing/grid-backdrop";
import { ScrollReveal } from "@/components/features/home/scroll-reveal";
import {
  MyAppointmentsList,
  type AppointmentListItem,
} from "@/components/features/my-appointments-list";

export const metadata: Metadata = {
  title: "Lịch hẹn của tôi",
  description: "Danh sách lịch hẹn sửa chữa bạn đã đặt qua FixNow.",
};

export default async function MyAppointmentsPage() {
  const session = await auth();

  // Default order = newest first (mirrored by the client island's default sort).
  const rows = session?.user?.id
    ? await db.query.appointments.findMany({
        where: eq(appointments.userId, session.user.id),
        orderBy: [desc(appointments.createdAt)],
        columns: {
          appointmentCode: true,
          deviceType: true,
          serviceGroup: true,
          status: true,
          createdAt: true,
        },
      })
    : [];

  // Serialise Date → ISO string for the client boundary.
  const items: AppointmentListItem[] = rows.map((r) => ({
    appointmentCode: r.appointmentCode,
    deviceType: r.deviceType,
    serviceGroup: r.serviceGroup,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <>
      <ScrollReveal />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5 bg-background py-14 md:py-20">
        <GridBackdrop />
        <div aria-hidden className="absolute right-[12%] top-0 h-64 w-64 rounded-full bg-secondary/10 blur-[130px]" />
        <div className="relative mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 font-mono text-label-sm uppercase tracking-widest text-secondary">
                &gt; MY_BOOKINGS
              </p>
              <h1 className="text-display-lg-mobile text-on-surface">
                Lịch hẹn của tôi
              </h1>
              <p className="mt-3 max-w-xl text-body-md text-on-surface-variant">
                Theo dõi, lọc và sắp xếp các yêu cầu sửa chữa bạn đã gửi cho
                FixNow.
              </p>
            </div>
            {items.length > 0 ? (
              <Link
                href="/booking"
                className="btn-gradient glow-cta inline-flex w-max items-center gap-2 rounded-xl px-7 py-3.5 font-mono text-label-md font-bold uppercase tracking-wider text-white"
              >
                <CalendarPlus className="size-5" />
                Đặt lịch mới
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* List + filter/sort (client island) */}
      <section className="relative bg-background py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop">
          {items.length === 0 ? (
            <div className="glass-panel fade-in-up mx-auto flex max-w-xl flex-col items-center gap-5 rounded-3xl p-10 text-center md:p-14">
              <span className="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-surface-container-high/50 text-on-surface-variant">
                <CalendarX className="size-8" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="text-headline-sm text-on-surface">
                  Bạn chưa có lịch hẹn nào
                </p>
                <p className="text-body-md text-on-surface-variant">
                  Đặt lịch ngay để FixNow hỗ trợ kỹ thuật tận nơi.
                </p>
              </div>
              <Link
                href="/booking"
                className="btn-gradient glow-cta inline-flex items-center gap-2 rounded-xl px-8 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
              >
                Đặt lịch ngay <ArrowRight className="size-5" />
              </Link>
            </div>
          ) : (
            <MyAppointmentsList items={items} />
          )}
        </div>
      </section>
    </>
  );
}
