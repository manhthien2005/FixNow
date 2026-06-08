import Image from "next/image";
import { resolveServiceImage } from "@/lib/images";
import Link from "next/link";
import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import {
  ArrowRight,
  Bug,
  Cpu,
  Info,
  Printer,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";

import { unstable_cache } from "next/cache";

import { db } from "@/db";
import { servicePrices, type ServicePrice } from "@/db/schema";
import { GridBackdrop } from "@/components/marketing/grid-backdrop";
import { ScrollReveal } from "@/components/features/home/scroll-reveal";

export const metadata: Metadata = {
  title: "Bảng giá",
  description:
    "Giá tham khảo các dịch vụ sửa chữa & bảo trì của FixNow, phân loại rõ ràng theo nhóm. KTV báo giá chính xác sau khi kiểm tra máy.",
};

// Cache the price catalog (changes rarely) at the data layer — survives the
// dynamic route (navbar reads auth cookies). Revalidated hourly.
export const revalidate = 3600;

const getServicePrices = unstable_cache(
  () =>
    db.query.servicePrices.findMany({
      where: eq(servicePrices.isActive, true),
      orderBy: [asc(servicePrices.sortOrder)],
    }),
  ["active-service-prices"],
  { revalidate: 3600, tags: ["service-prices"] },
);

type Accent = "secondary" | "primary" | "tertiary";

const TILE: Record<Accent, string> = {
  secondary: "text-secondary shadow-[0_0_15px_rgba(93,230,255,0.18)]",
  primary: "text-primary shadow-[0_0_15px_rgba(173,198,255,0.18)]",
  tertiary: "text-tertiary shadow-[0_0_15px_rgba(208,188,255,0.18)]",
};

// Presentation-only categorisation (keyword match, first wins, fallback "Khác").
const CATEGORIES: {
  key: string;
  label: string;
  icon: LucideIcon;
  accent: Accent;
  image: string;
  test: (name: string) => boolean;
}[] = [
  {
    key: "inspect",
    label: "Kiểm tra & vệ sinh",
    icon: ScanSearch,
    accent: "secondary",
    image: "/images/service-diagnostics.jpg",
    test: (n) => /kiểm tra|vệ sinh|chẩn đoán/i.test(n),
  },
  {
    key: "software",
    label: "Phần mềm & dữ liệu",
    icon: Bug,
    accent: "primary",
    image: "/images/service-software.jpg",
    test: (n) => /windows|virus|phần mềm|từ xa|teamviewer|anydesk|dữ liệu|rác/i.test(n),
  },
  {
    key: "hardware",
    label: "Phần cứng & nâng cấp",
    icon: Cpu,
    accent: "tertiary",
    image: "/images/service-upgrade.jpg",
    test: (n) => /ram|ssd|hdd|pin|phần cứng|màn hình|bàn phím|sạc|nâng cấp/i.test(n),
  },
  {
    key: "office",
    label: "Văn phòng & mạng",
    icon: Printer,
    accent: "secondary",
    image: "/images/service-printer.jpg",
    test: (n) => /mạng|wifi|máy in|văn phòng/i.test(n),
  },
];

const FALLBACK = {
  key: "other",
  label: "Dịch vụ khác",
  icon: Info,
  accent: "primary" as Accent,
  image: "/images/service-laptop.jpg",
};

function priceClass(price: string): string {
  if (/miễn phí/i.test(price)) return "text-secondary";
  if (/^\s*từ/i.test(price)) return "text-primary";
  return "text-tertiary";
}

function firstMatch(name: string): string {
  return CATEGORIES.find((c) => c.test(name))?.key ?? "other";
}

function groupServices(rows: ServicePrice[]) {
  return [...CATEGORIES, FALLBACK]
    .map((cat) => ({
      cat,
      items: rows.filter((r) => firstMatch(r.serviceName) === cat.key),
    }))
    .filter((g) => g.items.length > 0);
}

export default async function PricingPage() {
  const services = await getServicePrices();

  const groups = groupServices(services);

  return (
    <>
      <ScrollReveal />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-background py-20 md:py-28">
        <GridBackdrop />
        <div aria-hidden className="absolute right-[12%] top-0 h-72 w-72 rounded-full bg-primary/10 blur-[140px]" />
        <div aria-hidden className="absolute -bottom-10 left-[8%] h-72 w-96 rounded-full bg-secondary/10 blur-[150px]" />
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up max-w-3xl">
            <p className="mb-4 font-mono text-label-sm uppercase tracking-widest text-secondary">
              &gt; PRICE_BOARD
            </p>
            <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
              Bảng giá <span className="text-gradient">minh bạch</span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">
              Giá tham khảo theo từng nhóm dịch vụ. Kỹ thuật viên luôn kiểm tra
              máy và báo giá chính xác trước khi sửa.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="fade-in-up stagger-1 mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 md:p-5">
            <Info className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden="true" />
            <p className="text-body-md text-on-surface-variant">
              Đây là giá tham khảo. Chi phí linh kiện thay thế tính riêng theo{" "}
              <Link href="/parts" className="text-secondary hover:underline">
                bảng giá linh kiện
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Categorised price groups */}
      <section className="relative overflow-hidden bg-background py-20 md:py-24">
        <div className="relative mx-auto max-w-container-max space-y-14 px-margin-mobile md:px-margin-desktop">
          {groups.map((group, gi) => {
            const Icon = group.cat.icon;
            return (
              <div key={group.cat.key} className="fade-in-up">
                <div className="mb-6 flex items-center gap-4">
                  <span className={`flex size-12 items-center justify-center rounded-xl border border-white/10 bg-surface-container-high/50 ${TILE[group.cat.accent]}`}>
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-headline-sm text-on-surface">
                      {group.cat.label}
                    </h2>
                    <p className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant/60">
                      {String(group.items.length).padStart(2, "0")} dịch vụ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((service, i) => {
                    const CatIcon = group.cat.icon;
                    return (
                      <article
                        key={service.id}
                        className={`glass-panel fade-in-up stagger-${i % 4} group flex h-full flex-col overflow-hidden rounded-2xl transition-colors hover:border-white/20`}
                      >
                        {/* Thumbnail banner */}
                        <div className="relative h-28 overflow-hidden">
                          <Image
                            src={resolveServiceImage(service.imagePath, group.cat.image)}
                            alt={group.cat.label}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                            className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent" />
                          <span className={`absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-lg border border-white/10 bg-surface-container-lowest/80 backdrop-blur ${TILE[group.cat.accent]}`}>
                            <CatIcon className="size-5" aria-hidden="true" />
                          </span>
                        </div>

                        {/* Body */}
                        <div className="flex flex-1 flex-col gap-3 p-6">
                          <h3 className="text-body-lg font-semibold leading-snug text-on-surface">
                            {service.serviceName}
                          </h3>
                          {service.note ? (
                            <p className="text-body-md text-on-surface-variant">
                              {service.note}
                            </p>
                          ) : null}
                          <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-4">
                            <span className={`text-headline-sm font-bold ${priceClass(service.priceFrom)}`}>
                              {service.priceFrom}
                            </span>
                            <Link
                              href="/booking"
                              className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant transition-colors group-hover:text-secondary"
                            >
                              Đặt →
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {gi < groups.length - 1 ? (
                  <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/5 bg-surface-container-lowest py-16">
        <div className="relative mx-auto flex max-w-container-max flex-col items-center justify-between gap-6 px-margin-mobile text-center md:flex-row md:px-margin-desktop md:text-left">
          <div>
            <h2 className="text-headline-sm text-on-surface">
              Cần biết giá linh kiện thay thế?
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Tra cứu RAM, SSD, HDD, pin, phụ kiện kèm bảo hành tại trang linh kiện.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/parts"
              className="glass-panel inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-on-surface transition-colors hover:bg-white/10"
            >
              Giá linh kiện
            </Link>
            <Link
              href="/booking"
              className="btn-gradient glow-cta inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
            >
              Đặt lịch ngay <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
