import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CancelAppointmentButton } from "@/components/features/cancel-appointment-button";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  APPOINTMENT_STATUS_LABEL,
  APPOINTMENT_STATUS_VARIANT,
  DEVICE_TYPE_LABEL,
} from "@/lib/labels";
import { formatDateVi } from "@/lib/utils";

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

  if (!session?.user?.id) {
    notFound();
  }

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

  if (!appt) {
    notFound();
  }

  const canCancel = appt.status === "RECEIVED";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/my-appointments">
          <ArrowLeft className="mr-2 size-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mã lịch hẹn</p>
              <p className="font-mono text-2xl font-bold text-primary md:text-3xl">
                {appt.appointmentCode}
              </p>
            </div>
            <Badge
              variant={APPOINTMENT_STATUS_VARIANT[appt.status]}
              className="w-fit"
            >
              {APPOINTMENT_STATUS_LABEL[appt.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm text-muted-foreground">Tên khách</dt>
              <dd className="mt-1 text-base font-medium">
                {appt.customerName}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm text-muted-foreground">Số điện thoại</dt>
              <dd className="mt-1 text-base font-medium">{appt.phone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm text-muted-foreground">Loại thiết bị</dt>
              <dd className="mt-1 text-base font-medium">
                {DEVICE_TYPE_LABEL[appt.deviceType]}
              </dd>
            </div>
            <div className="sm:col-span-3">
              <dt className="text-sm text-muted-foreground">Địa chỉ</dt>
              <dd className="mt-1 text-base font-medium">{appt.address}</dd>
            </div>
            <div className="sm:col-span-3">
              <dt className="text-sm text-muted-foreground">Nhóm dịch vụ</dt>
              <dd className="mt-1 text-base font-medium">
                {appt.serviceGroup}
              </dd>
            </div>
            <div className="sm:col-span-3">
              <dt className="text-sm text-muted-foreground">Mô tả lỗi</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-base">
                {appt.issueDescription}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm text-muted-foreground">
                Thời gian mong muốn
              </dt>
              <dd className="mt-1 text-base font-medium">
                {appt.preferredTime
                  ? formatDateVi(appt.preferredTime)
                  : "Linh hoạt"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm text-muted-foreground">Ngày tạo</dt>
              <dd className="mt-1 text-base font-medium">
                {formatDateVi(appt.createdAt)}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm text-muted-foreground">
                Cập nhật gần nhất
              </dt>
              <dd className="mt-1 text-base font-medium">
                {formatDateVi(appt.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          {canCancel ? (
            <CancelAppointmentButton code={appt.appointmentCode} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Lịch hẹn không thể huỷ ở trạng thái hiện tại.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
