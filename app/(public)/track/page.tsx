import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { AlertCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TrackForm } from "@/components/features/track-form";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import {
  APPOINTMENT_STATUS_LABEL,
  APPOINTMENT_STATUS_VARIANT,
  DEVICE_TYPE_LABEL,
} from "@/lib/labels";
import { formatDateVi } from "@/lib/utils";

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

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold md:text-4xl">Tra cứu lịch hẹn</h1>
          <p className="mt-3 text-muted-foreground">
            Nhập số điện thoại và mã lịch hẹn để xem trạng thái xử lý.
          </p>
        </div>

        <div className="mt-8">
          <TrackForm defaultPhone={phone} defaultCode={code} />
        </div>

        {hasQuery && !appt ? (
          <Card className="mt-6 border-destructive/40 bg-destructive/5">
            <CardContent className="flex items-start gap-3 p-4 md:p-6">
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-destructive"
              />
              <div>
                <p className="font-semibold text-destructive">
                  Không tìm thấy lịch hẹn
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Không tìm thấy lịch hẹn với SĐT và mã đã nhập. Vui lòng kiểm
                  tra lại.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {appt ? (
          <Card className="mt-6">
            <CardHeader className="space-y-1">
              <p className="text-sm text-muted-foreground">Mã lịch hẹn</p>
              <p className="font-mono text-2xl font-bold text-primary md:text-3xl">
                {appt.appointmentCode}
              </p>
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
                  <dt className="text-sm text-muted-foreground">
                    Số điện thoại
                  </dt>
                  <dd className="mt-1 text-base font-medium">{appt.phone}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm text-muted-foreground">
                    Loại thiết bị
                  </dt>
                  <dd className="mt-1 text-base font-medium">
                    {DEVICE_TYPE_LABEL[appt.deviceType]}
                  </dd>
                </div>
                <div className="sm:col-span-3">
                  <dt className="text-sm text-muted-foreground">Địa chỉ</dt>
                  <dd className="mt-1 text-base font-medium">
                    {appt.address}
                  </dd>
                </div>
                <div className="sm:col-span-3">
                  <dt className="text-sm text-muted-foreground">
                    Nhóm dịch vụ
                  </dt>
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
            <CardFooter>
              <Badge variant={APPOINTMENT_STATUS_VARIANT[appt.status]}>
                {APPOINTMENT_STATUS_LABEL[appt.status]}
              </Badge>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
