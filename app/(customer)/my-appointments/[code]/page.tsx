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
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

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
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isVi = locale === "vi";
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
      <section className="relative overflow-hidden border-b border-border bg-background py-12 md:py-16">
        <GridBackdrop />
        <div aria-hidden className={`absolute right-[12%] top-0 h-56 w-56 rounded-full blur-[130px] ${ui.bg}`} />
        <div className="relative mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <Link
            href="/my-appointments"
            className="mb-6 inline-flex items-center gap-2 font-mono text-label-sm uppercase tracking-wider text-on-surface-variant transition-colors hover:text-secondary"
          >
            <ArrowLeft className="size-4" />
            {isVi ? "Danh sách lịch hẹn" : "Appointment list"}
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-label-sm uppercase tracking-widest text-on-surface-variant/60">
                {dictionary.track.code}
              </p>
              <p className="font-mono text-display-lg-mobile font-bold text-on-surface">
                {appt.appointmentCode}
              </p>
            </div>
            <span
              className={`inline-flex w-max items-center gap-2 rounded-full border ${ui.border} ${ui.bg} px-4 py-2 font-mono text-label-md ${ui.text}`}
            >
              <StatusIcon className="size-4" aria-hidden="true" />
              {dictionary.labels.appointmentStatus[appt.status]}
            </span>
          </div>
        </div>
      </section>

      <section className="relative bg-background py-10 md:py-14">
        <div className="mx-auto max-w-3xl space-y-6 px-margin-mobile md:px-margin-desktop">
          <AppointmentDetail appt={appt} />

          {/* Cancel */}
          <div className="flex flex-col items-start gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            {canCancel ? (
              <>
                <p className="text-body-md text-on-surface-variant">
                  {isVi
                    ? "Bạn có thể huỷ khi lịch hẹn còn ở trạng thái \"Đã nhận\"."
                    : "You can cancel while the appointment is still in Received status."}
                </p>
                <CancelAppointmentButton code={appt.appointmentCode} />
              </>
            ) : (
              <p className="text-body-md text-on-surface-variant">
                {isVi
                  ? "Lịch hẹn không thể huỷ ở trạng thái hiện tại."
                  : "This appointment cannot be cancelled in its current status."}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
