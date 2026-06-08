import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";

import { PartsExplorer } from "@/components/features/parts-explorer";
import { db } from "@/db";
import { parts } from "@/db/schema";

export const metadata: Metadata = {
  title: "Linh kiện",
  description:
    "Tra cứu giá tham khảo RAM, SSD, HDD, pin, phụ kiện cho laptop / PC.",
};

export default async function PartsPage() {
  const items = await db.query.parts.findMany({
    where: eq(parts.isActive, true),
    orderBy: [asc(parts.type), asc(parts.name)],
  });

  return (
    <>
      {/* Hero strip */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Giá linh kiện
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            Giá thị trường thay đổi liên tục, vui lòng liên hệ để xác nhận giá
            tại thời điểm sửa chữa.
          </p>
        </div>
      </section>

      {/* Search + filter + grid (client island) */}
      <section>
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          <PartsExplorer parts={items} />
        </div>
      </section>
    </>
  );
}
