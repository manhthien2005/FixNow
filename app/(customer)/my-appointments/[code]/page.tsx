import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import { CancelAppointmentButton } from "@/components/features/cancel-appointment-button";
import { AppointmentDetail } from "@/components/features/appointments/appointment-detail";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { STATUS_UI } from "@/lib/appointment-ui";
import { GridBackdrop } from "@/components/marketing/grid-backdrop";

interface AppointmentDetailPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({
  params,
}: AppointmentDetailPageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Lịch hẹn ${code}`,
    description: `Chi tiết lịch hẹn ${code} trên FixNow.`,
  };
}

export default async function AppointmentDetailPage({
  params,
}: AppointmentDetailPageProps) {
  const { code } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const appt = await db.query.appointments.findFirst({
    where: and(
      eq(appointments.appointmentCode, code),
      eq(appointments.userId, session.user.id),
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
  });

  if (!appt) notFound();

  const ui = STATUS_UI[appt.status];
  const StatusIcon = ui.icon;
  const canCancel = appt.status === "RECEIVED";

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5 bg-background py-12 md:py-16">
        <GridBackdrop />
        <div aria-hidden className={`absolute right-[12%] top-0 h-56 w-56 rounded-full blur-[130px] ${ui.bg}`} />
        <div className="relative mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <Link
            href="/my-appointments"
            className="mb-6 inline-flex items-center gap-2 font-mono text-label-sm uppercase tracking-wider text-on-surface-variant transition-colors hover:text-secondary"
          >
            <ArrowLeft className="size-4" />
            Danh sách lịch hẹn
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-label-sm uppercase tracking-widest text-on-surface-variant/60">
                Mã lịch hẹn
              </p>
              <p className="font-mono text-display-lg-mobile font-bold text-on-surface">
                {appt.appointmentCode}
              </p>
            </div>
            <span
              className={`inline-flex w-max items-center gap-2 rounded-full border ${ui.border} ${ui.bg} px-4 py-2 font-mono text-label-md ${ui.text}`}
            >
              <StatusIcon className="size-4" aria-hidden="true" />
              {ui.label}
            </span>
          </div>
        </div>
      </section>

      <section className="relative bg-background py-10 md:py-14">
        <div className="mx-auto max-w-3xl space-y-6 px-margin-mobile md:px-margin-desktop">
          <AppointmentDetail appt={appt} />

          {/* Cancel */}
          <div className="flex flex-col items-start gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
            {canCancel ? (
              <>
                <p className="text-body-md text-on-surface-variant">
                  Bạn có thể huỷ khi lịch hẹn còn ở trạng thái “Đã nhận”.
                </p>
                <CancelAppointmentButton code={appt.appointmentCode} />
              </>
            ) : (
              <p className="text-body-md text-on-surface-variant">
                Lịch hẹn không thể huỷ ở trạng thái hiện tại.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
