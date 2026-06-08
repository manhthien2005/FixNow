import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { Info } from "lucide-react";

import { db } from "@/db";
import { parts } from "@/db/schema";
import { PartsExplorer } from "@/components/features/parts-explorer";
import { GridBackdrop } from "@/components/marketing/grid-backdrop";
import { ScrollReveal } from "@/components/features/home/scroll-reveal";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Linh kiện",
  description:
    "Tra cứu giá tham khảo RAM, SSD, HDD, pin, phụ kiện cho laptop / PC — kèm bảo hành, tìm kiếm và lọc theo loại.",
};

// Cache the parts catalog at the data layer (route is dynamic via navbar auth).
export const revalidate = 3600;

const getParts = unstable_cache(
  () =>
    db.query.parts.findMany({
      where: eq(parts.isActive, true),
      orderBy: [asc(parts.type), asc(parts.name)],
    }),
  ["active-parts"],
  { revalidate: 3600, tags: ["parts"] },
);

export default async function PartsPage() {
  const locale = await getLocale();
  const isVi = locale === "vi";
  const items = await getParts();

  return (
    <>
      <ScrollReveal />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-background py-20 md:py-28">
        <GridBackdrop />
        <div aria-hidden className="absolute right-[12%] top-0 h-72 w-72 rounded-full bg-tertiary/10 blur-[140px]" />
        <div aria-hidden className="absolute -bottom-10 left-[8%] h-72 w-96 rounded-full bg-secondary/10 blur-[150px]" />
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up max-w-3xl">
            <p className="mb-4 font-mono text-label-sm uppercase tracking-widest text-secondary">
              &gt; PARTS_CATALOG
            </p>
            <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
              {isVi ? "Tra cứu" : "Browse"}{" "}
              <span className="text-gradient">
                {isVi ? "linh kiện" : "parts"}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">
              {isVi
                ? "Giá tham khảo RAM, SSD, HDD, pin, phụ kiện kèm thời gian bảo hành. Tìm kiếm theo tên hoặc lọc nhanh theo loại."
                : "Reference pricing for RAM, SSD, HDD, batteries, and accessories with warranty notes. Search by name or filter by type."}
            </p>
          </div>

          <div className="fade-in-up stagger-1 mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 md:p-5">
            <Info className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden="true" />
            <p className="text-body-md text-on-surface-variant">
              {isVi
                ? "Giá thị trường thay đổi liên tục - vui lòng liên hệ để xác nhận giá tại thời điểm sửa chữa."
                : "Market prices change often - please contact us to confirm the current repair-time price."}
            </p>
          </div>
        </div>
      </section>

      {/* Explorer (search + filter + grid) */}
      <section className="relative overflow-hidden bg-background py-12 md:py-16">
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <PartsExplorer parts={items} />
        </div>
      </section>
    </>
  );
}
