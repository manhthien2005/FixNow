import Link from "next/link";
import type { Metadata } from "next";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { ChevronRight } from "lucide-react";

import { AdminAppointmentsFilter } from "@/components/features/admin-appointments-filter";
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
import {
  appointmentStatusEnum,
  appointments,
  type AppointmentStatus,
} from "@/db/schema";
import {
  APPOINTMENT_STATUS_LABEL,
  APPOINTMENT_STATUS_VARIANT,
  getServiceGroupLabel,
} from "@/lib/labels";
import { formatDateByLocale } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Lịch hẹn",
  description: "Quản lý danh sách lịch hẹn FixNow.",
};

const PAGE_SIZE = 20;

const STATUS_VALUES = appointmentStatusEnum.enumValues;
function isValidStatus(value: string): value is AppointmentStatus {
  return (STATUS_VALUES as readonly string[]).includes(value);
}

interface AdminAppointmentsPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function AdminAppointmentsPage({
  searchParams,
}: AdminAppointmentsPageProps) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const isVi = locale === "vi";
  const sp = await searchParams;

  const status: AppointmentStatus | undefined =
    sp.status && isValidStatus(sp.status) ? sp.status : undefined;
  const q = sp.q?.trim() ? sp.q.trim() : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const conds: SQL[] = [];
  if (status) conds.push(eq(appointments.status, status));
  if (q) {
    const escaped = q.replace(/[%_\\]/g, "\\$&");
    const pattern = `%${escaped}%`;
    const search = or(
      ilike(appointments.appointmentCode, pattern),
      ilike(appointments.phone, pattern),
    );
    if (search) conds.push(search);
  }
  const where: SQL | undefined =
    conds.length === 0
      ? undefined
      : conds.length === 1
        ? conds[0]
        : and(...conds);

  const [totalRow, rows] = await Promise.all([
    db.select({ value: count() }).from(appointments).where(where),
    db.query.appointments.findMany({
      where,
      orderBy: [desc(appointments.createdAt)],
      limit: PAGE_SIZE,
      offset,
      columns: {
        appointmentCode: true,
        customerName: true,
        phone: true,
        deviceType: true,
        serviceGroup: true,
        status: true,
        createdAt: true,
        userId: true,
      },
    }),
  ]);

  const total = Number(totalRow[0]?.value ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/admin/appointments?${qs}` : "/admin/appointments";
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold md:text-4xl">
          {dictionary.adminNav.appointments}
        </h1>
        <p className="text-sm text-muted-foreground">
          {total} {isVi ? "đơn" : "orders"}
        </p>
      </div>

      <div className="mt-6">
        <AdminAppointmentsFilter
          initialStatus={status ?? "ALL"}
          initialQ={q ?? ""}
        />
      </div>

      {rows.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-base font-semibold">
              {isVi
                ? "Không có lịch hẹn nào phù hợp."
                : "No appointments match the current filters."}
            </p>
            <p className="text-sm text-muted-foreground">
              {isVi
                ? "Thử thay đổi bộ lọc hoặc xoá tìm kiếm để xem toàn bộ."
                : "Change the filter or clear the search to view all appointments."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mt-6 hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dictionary.common.code}</TableHead>
                  <TableHead>{dictionary.common.customer}</TableHead>
                  <TableHead>{dictionary.common.phone}</TableHead>
                  <TableHead>{dictionary.common.device}</TableHead>
                  <TableHead>{dictionary.common.service}</TableHead>
                  <TableHead>{dictionary.common.status}</TableHead>
                  <TableHead>{isVi ? "Ngày tạo" : "Created"}</TableHead>
                  <TableHead className="w-[100px]">
                    <span className="sr-only">{dictionary.common.detail}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((appt) => (
                  <TableRow key={appt.appointmentCode}>
                    <TableCell className="font-mono font-semibold text-primary">
                      {appt.appointmentCode}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{appt.customerName}</span>
                        {appt.userId === null ? (
                          <Badge
                            variant="outline"
                            className="w-fit text-[10px] uppercase"
                          >
                            {isVi ? "Khách lẻ" : "Guest"}
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {appt.phone}
                    </TableCell>
                    <TableCell>
                      {dictionary.labels.deviceType[appt.deviceType]}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {getServiceGroupLabel(appt.serviceGroup, locale)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={APPOINTMENT_STATUS_VARIANT[appt.status]}>
                        {dictionary.labels.appointmentStatus[appt.status] ??
                          APPOINTMENT_STATUS_LABEL[appt.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateByLocale(appt.createdAt, locale)}
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          href={`/admin/appointments/${appt.appointmentCode}`}
                          aria-label={`${dictionary.common.detail} ${appt.appointmentCode}`}
                        >
                          {dictionary.common.detail}
                          <ChevronRight className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="mt-6 flex flex-col gap-3 md:hidden">
            {rows.map((appt) => (
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
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{appt.customerName}</p>
                    {appt.userId === null ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase"
                      >
                        {isVi ? "Khách lẻ" : "Guest"}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="font-mono text-muted-foreground">
                    {appt.phone}
                  </p>
                  <p className="text-muted-foreground">
                    {dictionary.labels.deviceType[appt.deviceType]} ·{" "}
                    {getServiceGroupLabel(appt.serviceGroup, locale)}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {formatDateByLocale(appt.createdAt, locale)}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    {dictionary.common.detail}
                    <ChevronRight className="ml-1 size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 ? (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {isVi ? "Trang" : "Page"} {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              asChild={page > 1}
              variant="outline"
              size="sm"
              disabled={page <= 1}
            >
              {page > 1 ? (
                <Link href={pageHref(page - 1)}>
                  {isVi ? "Trước" : "Previous"}
                </Link>
              ) : (
                <span>{isVi ? "Trước" : "Previous"}</span>
              )}
            </Button>
            <Button
              asChild={page < totalPages}
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
            >
              {page < totalPages ? (
                <Link href={pageHref(page + 1)}>
                  {isVi ? "Sau" : "Next"}
                </Link>
              ) : (
                <span>{isVi ? "Sau" : "Next"}</span>
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
