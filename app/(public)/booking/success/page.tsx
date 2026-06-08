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
  getServiceGroupLabel,
} from "@/lib/labels";
import { formatDateByLocale } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

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
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isVi = locale === "vi";

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
          {dictionary.booking.successTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {dictionary.booking.successText}
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {dictionary.booking.successCode}
          </p>
          <p className="font-mono text-3xl font-bold text-primary">
            {appt.appointmentCode}
          </p>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm text-muted-foreground">
                {dictionary.common.customer}
              </dt>
              <dd className="mt-1 text-base font-medium">
                {appt.customerName}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm text-muted-foreground">
                {dictionary.common.phone}
              </dt>
              <dd className="mt-1 text-base font-medium">{appt.phone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm text-muted-foreground">
                {dictionary.booking.deviceType}
              </dt>
              <dd className="mt-1 text-base font-medium">
                {dictionary.labels.deviceType[appt.deviceType]}
              </dd>
            </div>
            <div className="sm:col-span-3">
              <dt className="text-sm text-muted-foreground">
                {dictionary.common.address}
              </dt>
              <dd className="mt-1 text-base font-medium">{appt.address}</dd>
            </div>
            <div className="sm:col-span-3">
              <dt className="text-sm text-muted-foreground">
                {dictionary.booking.serviceGroup}
              </dt>
              <dd className="mt-1 text-base font-medium">
                {getServiceGroupLabel(appt.serviceGroup, locale)}
              </dd>
            </div>
            <div className="sm:col-span-3">
              <dt className="text-sm text-muted-foreground">
                {dictionary.booking.issue}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-base">
                {appt.issueDescription}
              </dd>
            </div>
            <div className="sm:col-span-1">
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
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">
                {isVi ? "Ngày tạo" : "Created"}
              </dt>
              <dd className="mt-1 text-base font-medium">
                {formatDateByLocale(appt.createdAt, locale)}
              </dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Badge variant={APPOINTMENT_STATUS_VARIANT[appt.status]}>
            {dictionary.labels.appointmentStatus[appt.status] ??
              APPOINTMENT_STATUS_LABEL[appt.status]}
          </Badge>
        </CardFooter>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="h-11">
          <Link href={trackHref}>{dictionary.booking.trackNow}</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11">
          <Link href="/booking">{dictionary.booking.createAnother}</Link>
        </Button>
      </div>

      {session?.user ? (
        <div className="mt-4 text-center">
          <Button asChild variant="link">
            <Link href="/my-appointments">
              {isVi ? "Xem tất cả lịch hẹn của tôi" : "View all my appointments"}
            </Link>
          </Button>
        </div>
      ) : (
        <Card className="mt-6 bg-muted/40">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-semibold">
                {isVi
                  ? "Đăng ký tài khoản để theo dõi tất cả lịch hẹn"
                  : "Create an account to track all appointments"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isVi
                  ? "Lưu lịch sử sửa chữa và xem trạng thái cập nhật trong một nơi."
                  : "Keep repair history and status updates in one place."}
              </p>
            </div>
            <Button asChild variant="outline" className="h-11">
              <Link href="/register?callbackUrl=/my-appointments">
                {dictionary.common.register}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
