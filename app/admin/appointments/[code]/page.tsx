import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import { AdminStatusChanger } from "@/components/features/admin-status-changer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import {
  APPOINTMENT_STATUS_LABEL,
  APPOINTMENT_STATUS_VARIANT,
  getServiceGroupLabel,
} from "@/lib/labels";
import { formatDateByLocale } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

interface AdminAppointmentDetailPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({
  params,
}: AdminAppointmentDetailPageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Đơn ${code}`,
    description: `Chi tiết đơn ${code}.`,
  };
}

export default async function AdminAppointmentDetailPage({
  params,
}: AdminAppointmentDetailPageProps) {
  const { code } = await params;
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isVi = locale === "vi";

  const appt = await db.query.appointments.findFirst({
    where: eq(appointments.appointmentCode, code),
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
      userId: true,
      discountPercent: true,
      discountReason: true,
      verificationDiscountApplied: true,
    },
  });

  if (!appt) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/admin/appointments">
          <ArrowLeft className="mr-2 size-4" />
          {isVi ? "Quay lại danh sách" : "Back to list"}
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {dictionary.track.code}
              </p>
              <p className="font-mono text-2xl font-bold text-primary md:text-3xl">
                {appt.appointmentCode}
              </p>
            </div>
            <Badge
              variant={APPOINTMENT_STATUS_VARIANT[appt.status]}
              className="w-fit"
            >
              {dictionary.labels.appointmentStatus[appt.status] ??
                APPOINTMENT_STATUS_LABEL[appt.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">
                {dictionary.common.customer}
              </dt>
              <dd className="mt-1 flex flex-wrap items-center gap-2 text-base font-medium">
                <span>{appt.customerName}</span>
                {appt.userId === null ? (
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {isVi ? "Khách lẻ" : "Guest"}
                  </Badge>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {dictionary.common.phone}
              </dt>
              <dd className="mt-1 font-mono text-base font-medium">
                {appt.phone}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm text-muted-foreground">
                {dictionary.common.address}
              </dt>
              <dd className="mt-1 text-base font-medium">{appt.address}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {dictionary.booking.deviceType}
              </dt>
              <dd className="mt-1 text-base font-medium">
                {dictionary.labels.deviceType[appt.deviceType]}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {dictionary.booking.serviceGroup}
              </dt>
              <dd className="mt-1 text-base font-medium">
                {getServiceGroupLabel(appt.serviceGroup, locale)}
              </dd>
            </div>
            {appt.verificationDiscountApplied ? (
              <div className="md:col-span-2">
                <dt className="text-sm text-muted-foreground">
                  {isVi ? "Ưu đãi" : "Discount"}
                </dt>
                <dd className="mt-1 text-base font-medium text-primary">
                  -{appt.discountPercent}% ·{" "}
                  {appt.discountReason ??
                    (isVi ? "Ưu đãi xác thực" : "Verified discount")}
                </dd>
              </div>
            ) : null}
            <div className="md:col-span-2">
              <dt className="text-sm text-muted-foreground">
                {dictionary.booking.issue}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-base">
                {appt.issueDescription}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {dictionary.booking.preferredTime}
              </dt>
              <dd className="mt-1 text-base font-medium">
                {appt.preferredTime
                  ? formatDateByLocale(appt.preferredTime, locale)
                  : isVi
                    ? "Linh hoạt"
                    : "Flexible"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {isVi ? "Ngày tạo" : "Created"}
              </dt>
              <dd className="mt-1 text-base font-medium">
                {formatDateByLocale(appt.createdAt, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {isVi ? "Cập nhật gần nhất" : "Last updated"}
              </dt>
              <dd className="mt-1 text-base font-medium">
                {formatDateByLocale(appt.updatedAt, locale)}
              </dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <AdminStatusChanger
            code={appt.appointmentCode}
            currentStatus={appt.status}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
