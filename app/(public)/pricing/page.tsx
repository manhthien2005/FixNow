import Link from "next/link";
import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { CalendarPlus, Info } from "lucide-react";

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
import { servicePrices } from "@/db/schema";

export const metadata: Metadata = {
  title: "Bảng giá",
  description:
    "Giá tham khảo các dịch vụ sửa chữa & bảo trì của FixNow.",
};

export default async function PricingPage() {
  const services = await db.query.servicePrices.findMany({
    where: eq(servicePrices.isActive, true),
    orderBy: [asc(servicePrices.sortOrder)],
  });

  return (
    <>
      {/* Hero strip */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Bảng giá dịch vụ
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            Giá tham khảo cho các dịch vụ FixNow đang cung cấp. KTV sẽ kiểm tra
            máy và báo giá chính xác trước khi sửa.
          </p>
        </div>
      </section>

      {/* Disclaimer + price table */}
      <section>
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          {/* Disclaimer */}
          <Card className="mb-6 border-warning/40 bg-warning/10 shadow-none md:mb-8">
            <CardContent className="flex items-start gap-3 p-4 md:p-6">
              <Info
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-warning"
              />
              <p className="text-sm leading-relaxed text-foreground md:text-base">
                Giá tham khảo. KTV sẽ báo giá chính xác sau khi kiểm tra máy.
                Chi phí linh kiện thay thế tính riêng theo bảng giá linh kiện.
              </p>
            </CardContent>
          </Card>

          {/* Price table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-3 text-sm md:px-6">
                    Tên dịch vụ
                  </TableHead>
                  <TableHead className="px-4 py-3 text-sm md:px-6">
                    Giá tham khảo
                  </TableHead>
                  <TableHead className="px-4 py-3 text-sm md:px-6">
                    Ghi chú
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} className="hover:bg-muted/50">
                    <TableCell className="px-4 py-4 align-top text-sm font-medium md:px-6 md:text-base">
                      {service.serviceName}
                    </TableCell>
                    <TableCell className="px-4 py-4 align-top text-sm font-semibold text-primary md:px-6 md:text-base">
                      {service.priceFrom}
                    </TableCell>
                    <TableCell className="px-4 py-4 align-top text-sm text-muted-foreground md:px-6">
                      {service.note ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-10 text-center md:flex-row md:justify-between md:px-6 md:text-left">
          <p className="text-base text-muted-foreground">
            Cần biết giá linh kiện thay thế? Xem chi tiết tại trang linh kiện.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" size="lg">
              <Link href="/parts">Xem giá linh kiện</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/booking">
                <CalendarPlus aria-hidden="true" />
                Đặt lịch ngay
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
