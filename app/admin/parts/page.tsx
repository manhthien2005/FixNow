import type { Metadata } from "next";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import { parts } from "@/db/schema";
import { PartsManager } from "@/components/features/admin/parts-manager";

export const metadata: Metadata = { title: "Quản lý linh kiện" };

export const dynamic = "force-dynamic";

export default async function AdminPartsPage() {
  const rows = await db.query.parts.findMany({
    orderBy: [asc(parts.type), asc(parts.name)],
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý linh kiện</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Thêm, sửa, xóa linh kiện và tải ảnh hiển thị trên trang tra cứu.
        </p>
      </div>
      <PartsManager initialParts={rows} />
    </div>
  );
}
