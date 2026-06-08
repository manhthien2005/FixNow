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
} from "@/lib/labels";
import { formatDateByLocale } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

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
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isVi = locale === "vi";
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
      label: isVi ? "Tổng" : "Total",
      value: total,
      Icon: Layers,
      iconClass: "text-muted-foreground",
    },
    {
      key: "RECEIVED",
      label: dictionary.labels.appointmentStatus.RECEIVED,
      value: counts.RECEIVED,
      Icon: CircleDashed,
      iconClass: "text-primary",
    },
    {
      key: "IN_PROGRESS",
      label: dictionary.labels.appointmentStatus.IN_PROGRESS,
      value: counts.IN_PROGRESS,
      Icon: CircleAlert,
      iconClass: "text-amber-600",
    },
    {
      key: "COMPLETED",
      label: dictionary.labels.appointmentStatus.COMPLETED,
      value: counts.COMPLETED,
      Icon: CircleCheck,
      iconClass: "text-emerald-600",
    },
    {
      key: "CANCELLED",
      label: dictionary.labels.appointmentStatus.CANCELLED,
      value: counts.CANCELLED,
      Icon: CircleX,
      iconClass: "text-destructive",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold md:text-4xl">
          {dictionary.adminNav.dashboard}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isVi ? "Hôm nay" : "Today"} {formatDateByLocale(new Date(), locale)}
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
            <p className="font-semibold">
              {isVi ? "Quản lý linh kiện" : "Manage parts"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isVi
                ? "Thêm / sửa / xóa linh kiện, tải ảnh"
                : "Create, edit, delete parts and upload images"}
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
            <p className="font-semibold">
              {isVi ? "Quản lý dịch vụ" : "Manage services"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isVi
                ? "Thêm / sửa / xóa dịch vụ & giá, tải ảnh"
                : "Create, edit, delete services, pricing, and images"}
            </p>
          </div>
        </Link>
      </div>
      <Card className="mt-8">
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-lg md:text-xl">
              {isVi ? "Lịch hẹn gần đây" : "Recent appointments"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isVi
                ? "5 lịch hẹn mới nhất theo ngày tạo."
                : "The 5 newest appointments by creation date."}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/appointments">
              {isVi ? "Xem tất cả" : "View all"}
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
                {isVi
                  ? "Chưa có lịch hẹn nào trong hệ thống."
                  : "There are no appointments in the system yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dictionary.common.code}</TableHead>
                      <TableHead>{dictionary.common.customer}</TableHead>
                      <TableHead>{dictionary.common.device}</TableHead>
                      <TableHead>{dictionary.common.status}</TableHead>
                      <TableHead>{isVi ? "Ngày tạo" : "Created"}</TableHead>
                      <TableHead className="w-[60px]">
                        <span className="sr-only">{dictionary.common.detail}</span>
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
                          {dictionary.labels.deviceType[appt.deviceType]}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={APPOINTMENT_STATUS_VARIANT[appt.status]}
                          >
                            {dictionary.labels.appointmentStatus[appt.status] ??
                              APPOINTMENT_STATUS_LABEL[appt.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateByLocale(appt.createdAt, locale)}
                        </TableCell>
                        <TableCell>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            aria-label={`${dictionary.common.detail} ${appt.appointmentCode}`}
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
                        {dictionary.labels.appointmentStatus[appt.status] ??
                          APPOINTMENT_STATUS_LABEL[appt.status]}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {appt.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dictionary.labels.deviceType[appt.deviceType]}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {isVi ? "Tạo" : "Created"}:{" "}
                      {formatDateByLocale(appt.createdAt, locale)}
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
