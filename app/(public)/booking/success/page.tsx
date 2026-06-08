import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { CheckCircle2 } from "lucide-react";

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
import { auth } from "@/lib/auth";
import {
  APPOINTMENT_STATUS_LABEL,
  APPOINTMENT_STATUS_VARIANT,
  DEVICE_TYPE_LABEL,
} from "@/lib/labels";
import { formatDateVi } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Xác nhận đặt lịch",
  description: "Đã nhận lịch hẹn — FixNow sẽ liên hệ lại để xác nhận.",
};

interface SuccessPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function BookingSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { code } = await searchParams;

  if (!code) {
    notFound();
  }

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
    },
  });

  if (!appt) {
    notFound();
  }

  const session = await auth();

  const trackHref = `/track?phone=${encodeURIComponent(
    appt.phone,
  )}&code=${encodeURIComponent(appt.appointmentCode)}`;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent"
        >
          <CheckCircle2 className="size-16" />
        </span>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">
          Đã nhận lịch hẹn
        </h1>
        <p className="mt-2 text-muted-foreground">
          FixNow sẽ liên hệ trong giờ làm việc để xác nhận.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader className="space-y-1">
          <p className="text-sm text-muted-foreground">Mã lịch hẹn</p>
          <p className="font-mono text-3xl font-bold text-primary">
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
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Ngày tạo</dt>
              <dd className="mt-1 text-base font-medium">
                {formatDateVi(appt.createdAt)}
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href={trackHref}>Tra cứu lịch hẹn</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/booking">Đặt lịch khác</Link>
        </Button>
      </div>

      {session?.user ? (
        <div className="mt-4 text-center">
          <Button asChild variant="link">
            <Link href="/my-appointments">Xem tất cả lịch hẹn của tôi</Link>
          </Button>
        </div>
      ) : (
        <Card className="mt-6 bg-muted/40">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-semibold">
                Đăng ký tài khoản để theo dõi tất cả lịch hẹn
              </p>
              <p className="text-sm text-muted-foreground">
                Lưu lịch sử sửa chữa và xem trạng thái cập nhật trong một
                nơi.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/register?callbackUrl=/my-appointments">
                Đăng ký
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
