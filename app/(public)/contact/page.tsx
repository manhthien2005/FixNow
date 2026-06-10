import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { SITE, mapEmbedSrc, mapDirectionsHref } from "@/lib/site";
import { GridBackdrop } from "@/components/marketing/grid-backdrop";
import { ScrollReveal } from "@/components/features/home/scroll-reveal";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ FixNow qua hotline, Zalo hoặc email. Phục vụ tận nơi trong bán kính 3–5km nội thành TP.HCM.",
};

type Accent = "secondary" | "primary" | "tertiary";

const TILE: Record<Accent, string> = {
  secondary: "text-secondary shadow-[0_0_15px_rgba(93,230,255,0.18)]",
  primary: "text-primary shadow-[0_0_15px_rgba(173,198,255,0.18)]",
  tertiary: "text-tertiary shadow-[0_0_15px_rgba(208,188,255,0.18)]",
};

const METHODS: {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  accent: Accent;
}[] = [
  { icon: Phone, label: "Hotline", value: SITE.hotline.label, href: SITE.hotline.href, accent: "secondary" },
  { icon: MessageCircle, label: "Zalo OA", value: SITE.zalo.label, href: SITE.zalo.href, accent: "primary" },
  { icon: Mail, label: "Email", value: SITE.email.label, href: SITE.email.href, accent: "tertiary" },
  { icon: Globe, label: "Facebook", value: SITE.facebook.label, href: SITE.facebook.href, accent: "secondary" },
];

export default async function ContactPage() {
  const locale = await getLocale();
  const isVi = locale === "vi";
  const hours = isVi ? SITE.hours : "8:00 AM - 8:00 PM daily";
  const serviceRadius = isVi
    ? SITE.serviceRadius
    : "3-5km radius within central HCMC";

  return (
    <>
      <ScrollReveal />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-background py-20 md:py-28">
        <GridBackdrop />
        <div aria-hidden className="absolute right-[12%] top-0 h-72 w-72 rounded-full bg-secondary/10 blur-[140px]" />
        <div aria-hidden className="absolute -bottom-10 left-[8%] h-72 w-96 rounded-full bg-primary/10 blur-[150px]" />
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up max-w-3xl">
            <p className="mb-4 font-mono text-label-sm uppercase tracking-widest text-secondary">
              &gt; CONTACT
            </p>
            <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
              {isVi ? "Kết nối với" : "Contact"}{" "}
              <span className="text-gradient">FixNow</span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">
              {isVi
                ? "Gọi hotline, nhắn Zalo hoặc email - chúng tôi luôn sẵn sàng hỗ trợ kỹ thuật trong giờ làm việc."
                : "Call the hotline, message Zalo, or send an email. FixNow is ready to support technical issues during working hours."}
            </p>
          </div>
        </div>
      </section>

      {/* Methods + map */}
      <section className="relative overflow-hidden bg-background py-16 md:py-20">
        <div className="relative mx-auto grid max-w-container-max grid-cols-1 gap-8 px-margin-mobile md:px-margin-desktop lg:grid-cols-2">
          {/* Left: methods + info */}
          <div className="flex flex-col gap-4">
            {METHODS.map(({ icon: Icon, label, value, href, accent }, i) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className={`glass-panel fade-in-up stagger-${i % 4} group flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-outline`}
              >
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 ${TILE[accent]}`}>
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant/70">
                    {label}
                  </p>
                  <p className="truncate text-body-lg font-semibold text-on-surface">
                    {value}
                  </p>
                </div>
                <ArrowRight className="size-5 text-on-surface-variant transition-transform group-hover:translate-x-1 group-hover:text-secondary" />
              </a>
            ))}

            <div className="glass-panel fade-in-up stagger-2 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-label-md font-bold text-on-surface">
                    {isVi ? "Địa chỉ" : "Address"}
                  </p>
                  <p className="mt-1 text-body-md text-on-surface-variant">
                    {SITE.address}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
                  <Clock className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-label-md font-bold text-on-surface">
                    {isVi ? "Giờ làm việc" : "Working hours"}
                  </p>
                  <p className="mt-1 text-body-md text-on-surface-variant">
                    {hours} · {serviceRadius}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: map */}
          <div className="fade-in-up stagger-1 flex flex-col gap-4">
            <div className="glass-panel-heavy relative h-[380px] overflow-hidden rounded-2xl p-2 md:h-full md:min-h-[460px]">
              <iframe
                title={`${isVi ? "Bản đồ" : "Map"} FixNow - ${SITE.address}`}
                src={mapEmbedSrc()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full rounded-xl border-0 [color-scheme:light]"
              />
            </div>
            <a
              href={mapDirectionsHref()}
              target="_blank"
              rel="noreferrer"
              className="btn-gradient glow-cta inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
            >
              <Navigation className="size-5" />
              {isVi ? "Chỉ đường tới FixNow" : "Directions to FixNow"}
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border bg-surface-container-lowest py-16">
        <div className="relative mx-auto flex max-w-container-max flex-col items-center justify-between gap-6 px-margin-mobile text-center md:flex-row md:px-margin-desktop md:text-left">
          <div>
            <h2 className="text-headline-sm text-on-surface">
              {isVi ? "Cần sửa máy ngay?" : "Need a repair now?"}
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              {isVi
                ? "Đặt lịch online, kỹ thuật viên FixNow sẽ liên hệ xác nhận trong giờ làm việc."
                : "Book online and a FixNow technician will contact you during working hours to confirm."}
            </p>
          </div>
          <Link
            href="/booking"
            className="btn-gradient glow-cta inline-flex items-center justify-center gap-2 rounded-xl px-9 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
          >
            {isVi ? "Đặt lịch ngay" : "Book now"}{" "}
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
