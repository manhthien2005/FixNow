import Link from "next/link";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { CalendarX, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  title: "Lịch hẹn của tôi",
  description: "Danh sách lịch hẹn sửa chữa bạn đã đặt qua FixNow.",
};

export default async function MyAppointmentsPage() {
  const session = await auth();

  const list = session?.user?.id
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Lịch hẹn của tôi
            </h1>
            <p className="mt-2 text-muted-foreground">
              Theo dõi trạng thái các yêu cầu sửa chữa bạn đã gửi cho FixNow.
            </p>
          </div>
          {list.length > 0 ? (
            <Button asChild>
              <Link href="/booking">Đặt lịch mới</Link>
            </Button>
          ) : null}
        </div>

        {list.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:p-12">
              <span
                aria-hidden="true"
                className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                <CalendarX className="size-8" />
              </span>
              <div className="space-y-1">
                <p className="text-lg font-semibold">
                  Bạn chưa có lịch hẹn nào.
                </p>
                <p className="text-sm text-muted-foreground">
                  Đặt lịch ngay để FixNow hỗ trợ kỹ thuật tận nơi.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/booking">Đặt lịch ngay</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mt-6 hidden md:block">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã hẹn</TableHead>
                      <TableHead>Loại thiết bị</TableHead>
                      <TableHead>Nhóm dịch vụ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="w-[60px]">
                        <span className="sr-only">Chi tiết</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.map((appt) => (
                      <TableRow key={appt.appointmentCode}>
                        <TableCell className="font-mono font-semibold text-primary">
                          {appt.appointmentCode}
                        </TableCell>
                        <TableCell>
                          {DEVICE_TYPE_LABEL[appt.deviceType]}
                        </TableCell>
                        <TableCell>{appt.serviceGroup}</TableCell>
                        <TableCell>
                          <Badge
                            variant={APPOINTMENT_STATUS_VARIANT[appt.status]}
                          >
                            {APPOINTMENT_STATUS_LABEL[appt.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateVi(appt.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            aria-label={`Xem chi tiết ${appt.appointmentCode}`}
                          >
                            <Link
                              href={`/my-appointments/${appt.appointmentCode}`}
                            >
                              <ChevronRight className="size-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <div className="mt-6 flex flex-col gap-3 md:hidden">
              {list.map((appt) => (
                <Card
                  key={appt.appointmentCode}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-lg font-bold text-primary">
                        {appt.appointmentCode}
                      </p>
                      <Badge variant={APPOINTMENT_STATUS_VARIANT[appt.status]}>
                        {APPOINTMENT_STATUS_LABEL[appt.status]}
                      </Badge>
                    </div>
                    <dl className="space-y-1 text-sm">
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground">Thiết bị:</dt>
                        <dd className="font-medium">
                          {DEVICE_TYPE_LABEL[appt.deviceType]}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-muted-foreground">Dịch vụ:</dt>
                        <dd className="font-medium">{appt.serviceGroup}</dd>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tạo: {formatDateVi(appt.createdAt)}
                      </p>
                    </dl>
                    <Link
                      href={`/my-appointments/${appt.appointmentCode}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      Xem chi tiết
                      <ChevronRight className="ml-1 size-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
