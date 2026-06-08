import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Bug,
  Clock,
  Cpu,
  Headset,
  MapPin,
  Printer,
  Receipt,
  ScanSearch,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { SERVICE_GROUPS } from "@/lib/labels";
import { GridBackdrop } from "@/components/marketing/grid-backdrop";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ScrollReveal } from "@/components/features/home/scroll-reveal";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description:
    "6 nhóm dịch vụ sửa chữa & bảo trì laptop / PC tận nơi của FixNow — minh bạch, chuyên nghiệp, bảo hành rõ ràng.",
};

type Accent = "secondary" | "primary" | "tertiary";

const ACCENT: Record<
  Accent,
  { text: string; tile: string; glow: string; hover: string; border: string }
> = {
  secondary: {
    text: "text-secondary",
    tile: "text-secondary shadow-[0_0_15px_rgba(93,230,255,0.18)]",
    glow: "bg-secondary/20",
    hover: "group-hover:text-secondary",
    border: "hover:border-secondary/40",
  },
  primary: {
    text: "text-primary",
    tile: "text-primary shadow-[0_0_15px_rgba(173,198,255,0.18)]",
    glow: "bg-primary/20",
    hover: "group-hover:text-primary",
    border: "hover:border-primary/40",
  },
  tertiary: {
    text: "text-tertiary",
    tile: "text-tertiary shadow-[0_0_15px_rgba(208,188,255,0.18)]",
    glow: "bg-tertiary/20",
    hover: "group-hover:text-tertiary",
    border: "hover:border-tertiary/40",
  },
};

type ServiceCard = {
  title: (typeof SERVICE_GROUPS)[number];
  description: string;
  icon: LucideIcon;
  accent: Accent;
  image: string;
};

const SERVICES: ServiceCard[] = [
  {
    title: SERVICE_GROUPS[0],
    icon: ScanSearch,
    accent: "secondary",
    image: "/images/service-diagnostics.jpg",
    description:
      "Kỹ thuật viên đến tận nơi kiểm tra, chẩn đoán chính xác nguyên nhân lỗi máy trước khi báo giá.",
  },
  {
    title: SERVICE_GROUPS[1],
    icon: Bug,
    accent: "primary",
    image: "/images/service-software.jpg",
    description:
      "Cài đặt Windows, driver, diệt virus, xử lý lỗi treo, chậm, màn hình xanh — giữ nguyên dữ liệu.",
  },
  {
    title: SERVICE_GROUPS[2],
    icon: Wrench,
    accent: "tertiary",
    image: "/images/service-laptop.jpg",
    description:
      "Vệ sinh máy, tra keo tản nhiệt, kiểm tra ổ cứng, sạc, pin. Tối ưu nhiệt độ và độ ổn định.",
  },
  {
    title: SERVICE_GROUPS[3],
    icon: Cpu,
    accent: "secondary",
    image: "/images/service-upgrade.jpg",
    description:
      "Nâng RAM, SSD, HDD. Tư vấn linh kiện phù hợp nhu cầu và ngân sách, lắp đặt tận nơi.",
  },
  {
    title: SERVICE_GROUPS[4],
    icon: Printer,
    accent: "primary",
    image: "/images/service-printer.jpg",
    description:
      "Cài đặt máy in, wifi, mạng nội bộ cho văn phòng nhỏ và hộ kinh doanh. Bảo trì định kỳ.",
  },
  {
    title: SERVICE_GROUPS[5],
    icon: Headset,
    accent: "tertiary",
    image: "/images/service-remote.jpg",
    description:
      "Khắc phục sự cố phần mềm từ xa qua TeamViewer / AnyDesk khi chưa cần kỹ thuật viên đến nơi.",
  },
];

const COMMITMENTS = [
  { icon: Receipt, title: "Minh bạch giá", desc: "Báo giá trước khi sửa, không phụ phí ẩn.", accent: "secondary" as Accent },
  { icon: ShieldCheck, title: "Bảo hành rõ ràng", desc: "Cam kết bảo hành theo từng hạng mục.", accent: "primary" as Accent },
  { icon: Clock, title: "Nhanh trong ngày", desc: "Phản hồi trong giờ, đa số xong trong ngày.", accent: "tertiary" as Accent },
  { icon: MapPin, title: "Tận nơi 3–5km", desc: "Kỹ thuật viên cơ động đến tận nhà / VP.", accent: "secondary" as Accent },
] as const;

export default function ServicesPage() {
  return (
    <>
      <ScrollReveal />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-background py-20 md:py-28">
        <GridBackdrop />
        <div aria-hidden className="absolute right-[12%] top-0 h-72 w-72 rounded-full bg-secondary/10 blur-[140px]" />
        <div aria-hidden className="absolute -bottom-10 left-[8%] h-72 w-96 rounded-full bg-primary/10 blur-[150px]" />
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up max-w-3xl">
            <p className="mb-4 font-mono text-label-sm uppercase tracking-widest text-secondary">
              &gt; PROTOCOLS
            </p>
            <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
              Hệ sinh thái <span className="text-gradient">dịch vụ</span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">
              6 nhóm dịch vụ chuyên sâu, phục vụ từ khách cá nhân tới văn phòng
              nhỏ — chẩn đoán minh bạch, xử lý triệt để, bảo hành rõ ràng.
            </p>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="relative overflow-hidden bg-background py-20 md:py-24">
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ title, description, icon: Icon, accent, image }, i) => {
              const a = ACCENT[accent];
              return (
                <article
                  key={title}
                  className={`glass-panel fade-in-up stagger-${i % 4} group relative flex flex-col overflow-hidden rounded-2xl transition-colors ${a.border}`}
                >
                  {/* Image header */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container/95 via-surface-container/30 to-transparent" />
                    <span className="absolute right-4 top-4 font-mono text-label-sm text-white/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className={`absolute -bottom-6 left-6 flex size-14 items-center justify-center rounded-xl border border-white/10 bg-surface-container-lowest/80 backdrop-blur ${a.tile}`}>
                      <Icon className="size-7" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-8 pt-10">
                    <h3 className={`mb-3 text-headline-sm text-on-surface transition-colors ${a.hover}`}>
                      {title}
                    </h3>
                    <p className="mb-6 text-body-md text-on-surface-variant">
                      {description}
                    </p>
                    <Link
                      href="/booking"
                      className={`mt-auto inline-flex items-center gap-2 font-mono text-label-md uppercase tracking-wider ${a.text}`}
                    >
                      Đặt dịch vụ
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="relative overflow-hidden border-y border-white/5 bg-surface-container-lowest py-16 md:py-20">
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <SectionHeading
            eyebrow="WHY_FIXNOW"
            title="Cam kết của FixNow"
            subtitle="Bốn điều khách hàng luôn nhận được trong mọi lần phục vụ."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {COMMITMENTS.map(({ icon: Icon, title, desc, accent }, i) => {
              const a = ACCENT[accent];
              return (
                <div
                  key={title}
                  className={`glass-panel fade-in-up stagger-${i % 4} group relative overflow-hidden rounded-2xl p-6 transition-colors ${a.border}`}
                >
                  <span className="mb-4 block font-mono text-label-sm text-on-surface-variant/40">
                    0{i + 1}
                  </span>
                  <span className={`mb-4 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-surface-container-high/50 ${a.tile}`}>
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <p className={`text-body-lg font-semibold text-on-surface transition-colors ${a.hover}`}>
                    {title}
                  </p>
                  <p className="mt-1 text-body-md text-on-surface-variant">{desc}</p>
                  <div
                    aria-hidden
                    className={`absolute -bottom-10 -right-10 size-28 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${a.glow}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-background py-20">
        <div className="relative mx-auto max-w-3xl px-margin-mobile text-center md:px-margin-desktop">
          <div className="glass-panel-heavy fade-in-up relative overflow-hidden rounded-3xl p-8 md:p-12">
            <div aria-hidden className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-bl-full bg-secondary/10" />
            <div aria-hidden className="absolute bottom-0 left-0 -z-10 h-32 w-32 rounded-tr-full bg-primary/10" />
            <h2 className="text-headline-sm text-on-surface md:text-headline-md">
              Máy của bạn đang gặp vấn đề?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-body-md text-on-surface-variant">
              Đặt lịch chỉ trong 2 phút, kỹ thuật viên FixNow sẽ liên hệ xác nhận
              và đến tận nơi.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/booking"
                className="btn-gradient glow-cta inline-flex items-center gap-2 rounded-xl px-9 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
              >
                Đặt lịch ngay <ArrowRight className="size-5" />
              </Link>
              <Link
                href="/pricing"
                className="font-mono text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-secondary"
              >
                Xem bảng giá
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
