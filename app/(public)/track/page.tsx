import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { AlertCircle } from "lucide-react";

import { TrackForm } from "@/components/features/track-form";
import { AppointmentDetail } from "@/components/features/appointments/appointment-detail";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { STATUS_UI } from "@/lib/appointment-ui";
import { GridBackdrop } from "@/components/marketing/grid-backdrop";

export const metadata: Metadata = {
  title: "Tra cứu lịch hẹn",
  description:
    "Tra cứu trạng thái lịch hẹn sửa chữa bằng số điện thoại và mã lịch hẹn.",
};

interface TrackPageProps {
  searchParams: Promise<{ phone?: string; code?: string }>;
}

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const { phone, code } = await searchParams;
  const hasQuery = Boolean(phone && code);

  const appt = hasQuery
    ? await db.query.appointments.findFirst({
        where: and(
          eq(appointments.phone, phone!),
          eq(appointments.appointmentCode, code!),
        ),
        columns: {
          appointmentCode: true,
          customerName: true,
          phone: true,
          address: true,
          deviceType: true,
          serviceGroup: true,
          issueDescription: true,
          preferredTime: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    : null;

  const ui = appt ? STATUS_UI[appt.status] : null;

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5 bg-background py-16 md:py-20">
        <GridBackdrop />
        <div aria-hidden className="absolute right-[12%] top-0 h-64 w-64 rounded-full bg-secondary/10 blur-[130px]" />
        <div className="relative mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <p className="mb-3 font-mono text-label-sm uppercase tracking-widest text-secondary">
            &gt; TRACK_ORDER
          </p>
          <h1 className="text-display-lg-mobile text-on-surface">
            Tra cứu lịch hẹn
          </h1>
          <p className="mt-3 max-w-xl text-body-md text-on-surface-variant">
            Nhập số điện thoại và mã lịch hẹn (FN-YYYY-XXXX) để xem trạng thái xử
            lý — không cần đăng nhập.
          </p>
        </div>
      </section>

      {/* Form + result */}
      <section className="relative bg-background py-10 md:py-14">
        <div className="mx-auto max-w-3xl space-y-6 px-margin-mobile md:px-margin-desktop">
          <TrackForm defaultPhone={phone} defaultCode={code} />

          {hasQuery && !appt ? (
            <div className="glass-panel flex items-start gap-3 rounded-2xl border-destructive/30 bg-destructive/5 p-5">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
              <div>
                <p className="font-semibold text-on-surface">
                  Không tìm thấy lịch hẹn
                </p>
                <p className="mt-1 text-body-md text-on-surface-variant">
                  Không có lịch hẹn khớp với SĐT và mã đã nhập. Vui lòng kiểm tra
                  lại.
                </p>
              </div>
            </div>
          ) : null}

          {appt && ui ? (
            <>
              <div className="glass-panel flex items-center justify-between gap-3 rounded-2xl p-5">
                <div>
                  <p className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant/60">
                    Mã lịch hẹn
                  </p>
                  <p className="font-mono text-headline-sm font-bold text-on-surface">
                    {appt.appointmentCode}
                  </p>
                </div>
                <span
                  className={`inline-flex w-max items-center gap-2 rounded-full border ${ui.border} ${ui.bg} px-4 py-2 font-mono text-label-md ${ui.text}`}
                >
                  <ui.icon className="size-4" aria-hidden="true" />
                  {ui.label}
                </span>
              </div>
              <AppointmentDetail appt={appt} />
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
