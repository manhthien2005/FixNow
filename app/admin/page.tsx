import Link from "next/link";
import type { Metadata } from "next";
import { count, desc } from "drizzle-orm";
import {
  ChevronRight,
  ClipboardList,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleX,
  Cpu,
  Layers,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { appointments, type AppointmentStatus } from "@/db/schema";
import {
  APPOINTMENT_STATUS_LABEL,
  APPOINTMENT_STATUS_VARIANT,
  DEVICE_TYPE_LABEL,
} from "@/lib/labels";
import { formatDateVi } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bảng điều khiển",
  description: "Tổng quan lịch hẹn sửa chữa FixNow.",
};

type StatCard = {
  key: AppointmentStatus | "TOTAL";
  label: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
};

export default async function AdminDashboardPage() {
  const groupedRows = await db
    .select({ status: appointments.status, count: count() })
    .from(appointments)
    .groupBy(appointments.status);

  const counts: Record<AppointmentStatus, number> = {
    RECEIVED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };
  for (const row of groupedRows) {
    counts[row.status] = Number(row.count);
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const recent = await db.query.appointments.findMany({
    orderBy: [desc(appointments.createdAt)],
    limit: 5,
    columns: {
      appointmentCode: true,
      customerName: true,
      deviceType: true,
      status: true,
      createdAt: true,
    },
  });

  const stats: StatCard[] = [
    {
      key: "TOTAL",
      label: "Tổng",
      value: total,
      Icon: Layers,
      iconClass: "text-muted-foreground",
    },
    {
      key: "RECEIVED",
      label: APPOINTMENT_STATUS_LABEL.RECEIVED,
      value: counts.RECEIVED,
      Icon: CircleDashed,
      iconClass: "text-primary",
    },
    {
      key: "IN_PROGRESS",
      label: APPOINTMENT_STATUS_LABEL.IN_PROGRESS,
      value: counts.IN_PROGRESS,
      Icon: CircleAlert,
      iconClass: "text-amber-600",
    },
    {
      key: "COMPLETED",
      label: APPOINTMENT_STATUS_LABEL.COMPLETED,
      value: counts.COMPLETED,
      Icon: CircleCheck,
      iconClass: "text-emerald-600",
    },
    {
      key: "CANCELLED",
      label: APPOINTMENT_STATUS_LABEL.CANCELLED,
      value: counts.CANCELLED,
      Icon: CircleX,
      iconClass: "text-destructive",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold md:text-4xl">Bảng điều khiển</h1>
        <p className="text-sm text-muted-foreground">
          Hôm nay {formatDateVi(new Date())}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="flex flex-col gap-2 p-4 md:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <stat.Icon
                  aria-hidden="true"
                  className={`size-5 ${stat.iconClass}`}
                />
              </div>
              <p className="text-3xl font-bold tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Content management quick links */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/admin/parts"
          className="group flex items-center gap-4 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cpu className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">Quản lý linh kiện</p>
            <p className="text-sm text-muted-foreground">
              Thêm / sửa / xóa linh kiện, tải ảnh
            </p>
          </div>
        </Link>
        <Link
          href="/admin/services"
          className="group flex items-center gap-4 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Tag className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">Quản lý dịch vụ</p>
            <p className="text-sm text-muted-foreground">
              Thêm / sửa / xóa dịch vụ &amp; giá, tải ảnh
            </p>
          </div>
        </Link>
      </div>
      <Card className="mt-8">
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-lg md:text-xl">
              Lịch hẹn gần đây
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              5 lịch hẹn mới nhất theo ngày tạo.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/appointments">
              Xem tất cả
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <ClipboardList
                aria-hidden="true"
                className="size-10 text-muted-foreground"
              />
              <p className="text-sm text-muted-foreground">
                Chưa có lịch hẹn nào trong hệ thống.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã hẹn</TableHead>
                      <TableHead>Khách</TableHead>
                      <TableHead>Thiết bị</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="w-[60px]">
                        <span className="sr-only">Chi tiết</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map((appt) => (
                      <TableRow key={appt.appointmentCode}>
                        <TableCell className="font-mono font-semibold text-primary">
                          {appt.appointmentCode}
                        </TableCell>
                        <TableCell>{appt.customerName}</TableCell>
                        <TableCell>
                          {DEVICE_TYPE_LABEL[appt.deviceType]}
                        </TableCell>
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
                              href={`/admin/appointments/${appt.appointmentCode}`}
                            >
                              <ChevronRight className="size-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 md:hidden">
                {recent.map((appt) => (
                  <Link
                    key={appt.appointmentCode}
                    href={`/admin/appointments/${appt.appointmentCode}`}
                    className="block rounded-lg border bg-background p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-base font-bold text-primary">
                        {appt.appointmentCode}
                      </p>
                      <Badge variant={APPOINTMENT_STATUS_VARIANT[appt.status]}>
                        {APPOINTMENT_STATUS_LABEL[appt.status]}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {appt.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {DEVICE_TYPE_LABEL[appt.deviceType]}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Tạo: {formatDateVi(appt.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
