import type { Metadata } from "next";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import { servicePrices } from "@/db/schema";
import { ServicesManager } from "@/components/features/admin/services-manager";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Quản lý dịch vụ" };

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const locale = await getLocale();
  const isVi = locale === "vi";
  const rows = await db.query.servicePrices.findMany({
    orderBy: [asc(servicePrices.sortOrder)],
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {isVi ? "Quản lý dịch vụ" : "Manage services"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isVi
            ? "Thêm, sửa, xóa dịch vụ và giá tham khảo hiển thị trên trang bảng giá."
            : "Create, edit, and delete services and reference pricing shown on the pricing page."}
        </p>
      </div>
      <ServicesManager initialServices={rows} />
    </div>
  );
}
