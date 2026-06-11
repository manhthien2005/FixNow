import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Download,
  EyeOff,
  FileSignature,
  HardDrive,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { SITE } from "@/lib/site";
import { GridBackdrop } from "@/components/marketing/grid-backdrop";
import { ScrollReveal } from "@/components/features/home/scroll-reveal";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Chính sách bảo hành & bảo mật",
  description:
    "Chính sách bảo hành sửa chữa 30 ngày, bảo hành linh kiện theo hãng và cam kết an toàn dữ liệu cá nhân của FixNow.",
};

type Accent = "secondary" | "primary" | "tertiary";

const TILE: Record<Accent, string> = {
  secondary: "text-secondary shadow-[0_0_15px_rgba(93,230,255,0.18)]",
  primary: "text-primary shadow-[0_0_15px_rgba(173,198,255,0.18)]",
  tertiary: "text-tertiary shadow-[0_0_15px_rgba(208,188,255,0.18)]",
};

type Bilingual = { vi: string; en: string };

const WARRANTY_CARDS: {
  icon: LucideIcon;
  accent: Accent;
  title: Bilingual;
  value: Bilingual;
  desc: Bilingual;
}[] = [
  {
    icon: Clock,
    accent: "secondary",
    title: { vi: "Bảo hành sửa chữa", en: "Repair warranty" },
    value: { vi: "30 ngày", en: "30 days" },
    desc: {
      vi: "Nếu lỗi đã sửa tái phát trong vòng 30 ngày, FixNow sửa lại hoàn toàn miễn phí.",
      en: "If a repaired issue recurs within 30 days, FixNow fixes it again free of charge.",
    },
  },
  {
    icon: HardDrive,
    accent: "primary",
    title: { vi: "Bảo hành linh kiện", en: "Parts warranty" },
    value: { vi: "Theo hãng", en: "By brand" },
    desc: {
      vi: "Linh kiện thay thế (RAM, SSD, pin...) được bảo hành theo thời hạn chính hãng / nhà phân phối, ghi rõ trong bảng giá linh kiện.",
      en: "Replacement parts (RAM, SSD, battery...) carry the official brand/distributor warranty, shown in the parts price list.",
    },
  },
];

const VOID_CONDITIONS: Bilingual[] = [
  {
    vi: "Tự ý tháo máy hoặc bóc tem niêm phong của FixNow.",
    en: "Opening the device or breaking FixNow's seal without authorization.",
  },
  {
    vi: "Thiết bị vào nước, cháy nổ, rơi vỡ hoặc hư hỏng do tác động vật lý.",
    en: "Liquid damage, fire, drops, or other physical/environmental damage.",
  },
  {
    vi: "Lỗi phát sinh khác với hạng mục đã được FixNow sửa chữa.",
    en: "New faults different from the item FixNow originally repaired.",
  },
  {
    vi: "Thiết bị được đơn vị khác sửa chữa, can thiệp sau khi FixNow bàn giao.",
    en: "The device was serviced by a third party after FixNow handed it over.",
  },
];

const SECURITY: {
  icon: LucideIcon;
  accent: Accent;
  title: Bilingual;
  desc: Bilingual;
}[] = [
  {
    icon: EyeOff,
    accent: "secondary",
    title: {
      vi: "Không xem hay sao chép dữ liệu riêng",
      en: "We never view or copy your private data",
    },
    desc: {
      vi: "Kỹ thuật viên chỉ truy cập đúng phạm vi cần thiết để sửa lỗi — tuyệt đối không mở, sao chép hay chia sẻ ảnh, tài liệu, tài khoản cá nhân của bạn.",
      en: "Technicians only access what is strictly needed to fix the issue — never opening, copying, or sharing your photos, files, or personal accounts.",
    },
  },
  {
    icon: Download,
    accent: "primary",
    title: {
      vi: "Khuyến khích sao lưu trước khi sửa",
      en: "We encourage a backup before any repair",
    },
    desc: {
      vi: "Chúng tôi luôn nhắc bạn sao lưu dữ liệu quan trọng trước khi sửa và sẵn sàng hỗ trợ backup khi bạn cần.",
      en: "We always remind you to back up important data before a repair and can help you do it when needed.",
    },
  },
  {
    icon: Lock,
    accent: "tertiary",
    title: {
      vi: "Không cài phần mềm theo dõi",
      en: "No tracking software, ever",
    },
    desc: {
      vi: "FixNow cam kết không cài spyware, keylogger hay bất kỳ phần mềm theo dõi nào. Mọi phần mềm chỉ được cài khi bạn đồng ý.",
      en: "FixNow commits to never installing spyware, keyloggers, or any tracking software. Anything installed is only with your consent.",
    },
  },
  {
    icon: FileSignature,
    accent: "secondary",
    title: {
      vi: "Ký cam kết bảo mật khi bạn yêu cầu",
      en: "We sign a confidentiality pledge on request",
    },
    desc: {
      vi: "Với dữ liệu nhạy cảm, kỹ thuật viên sẵn sàng ký biên bản cam kết bảo mật trước khi thao tác trên thiết bị.",
      en: "For sensitive data, the technician is ready to sign a written confidentiality pledge before working on your device.",
    },
  },
];

export default async function PolicyPage() {
  const locale = await getLocale();
  const isVi = locale === "vi";

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
              &gt; POLICY
            </p>
            <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
              {isVi ? "Bảo hành &" : "Warranty &"}{" "}
              <span className="text-gradient">
                {isVi ? "An toàn dữ liệu" : "Data safety"}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-on-surface-variant">
              {isVi
                ? "FixNow cam kết minh bạch về bảo hành và đặt sự riêng tư dữ liệu của bạn lên hàng đầu trong mọi lần sửa chữa."
                : "FixNow stands for transparent warranties and puts the privacy of your data first in every repair."}
            </p>
          </div>
        </div>
      </section>

      {/* Warranty */}
      <section className="relative overflow-hidden bg-background py-16 md:py-20">
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up mb-10 flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
              <ShieldCheck className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-headline-sm text-on-surface md:text-headline-md">
              {isVi ? "Chính sách bảo hành" : "Warranty policy"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {WARRANTY_CARDS.map(({ icon: Icon, accent, title, value, desc }, i) => (
              <div
                key={title.en}
                className={`glass-panel fade-in-up stagger-${i % 4} rounded-2xl p-6`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 ${TILE[accent]}`}>
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant/70">
                      {isVi ? title.vi : title.en}
                    </p>
                    <p className="text-headline-sm font-bold text-on-surface">
                      {isVi ? value.vi : value.en}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-body-md text-on-surface-variant">
                  {isVi ? desc.vi : desc.en}
                </p>
              </div>
            ))}
          </div>

          {/* Void conditions */}
          <div className="fade-in-up stagger-2 mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-destructive/40 bg-destructive/10 text-destructive">
                <ShieldAlert className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-body-lg font-bold text-on-surface">
                {isVi ? "Trường hợp không áp dụng bảo hành" : "When the warranty does not apply"}
              </h3>
            </div>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {VOID_CONDITIONS.map((c) => (
                <li
                  key={c.en}
                  className="flex items-start gap-3 text-body-md text-on-surface-variant"
                >
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  {isVi ? c.vi : c.en}
                </li>
              ))}
            </ul>
          </div>

          {/* How to claim */}
          <div className="fade-in-up stagger-3 mt-8 rounded-2xl border border-border bg-surface-container-lowest p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
                <Wrench className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-body-lg font-bold text-on-surface">
                {isVi ? "Cách yêu cầu bảo hành" : "How to claim warranty"}
              </h3>
            </div>
            <ol className="flex flex-col gap-4">
              {[
                {
                  vi: `Liên hệ FixNow qua hotline ${SITE.hotline.label} hoặc Zalo kèm mã lịch hẹn của bạn.`,
                  en: `Contact FixNow via hotline ${SITE.hotline.label} or Zalo with your appointment code.`,
                },
                {
                  vi: "Kỹ thuật viên kiểm tra để xác nhận đúng lỗi đã sửa trước đó.",
                  en: "A technician inspects the device to confirm it is the previously repaired fault.",
                },
                {
                  vi: "FixNow sửa lại miễn phí nếu thuộc phạm vi bảo hành.",
                  en: "FixNow repairs it again free of charge if it is covered.",
                },
              ].map((step, i) => (
                <li key={step.en} className="flex items-start gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-container-high/50 font-mono text-label-md font-bold text-secondary">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-body-md text-on-surface-variant">
                    {isVi ? step.vi : step.en}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Data security */}
      <section className="relative overflow-hidden border-t border-border bg-surface-container-lowest py-16 md:py-20">
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up mb-3 flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
              <Lock className="size-6" aria-hidden="true" />
            </span>
            <h2 className="text-headline-sm text-on-surface md:text-headline-md">
              {isVi ? "An toàn dữ liệu cá nhân" : "Personal data safety"}
            </h2>
          </div>
          <p className="fade-in-up mb-10 max-w-2xl text-body-lg text-on-surface-variant">
            {isVi
              ? "Dữ liệu trên thiết bị là tài sản riêng tư của bạn. FixNow cam kết tôn trọng và bảo vệ dữ liệu đó trong suốt quá trình sửa chữa."
              : "The data on your device is private property. FixNow commits to respecting and protecting it throughout the repair process."}
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {SECURITY.map(({ icon: Icon, accent, title, desc }, i) => (
              <div
                key={title.en}
                className={`glass-panel fade-in-up stagger-${i % 4} flex flex-col gap-4 rounded-2xl p-6`}
              >
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 ${TILE[accent]}`}>
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-body-lg font-bold text-on-surface">
                    {isVi ? title.vi : title.en}
                  </h3>
                  <p className="mt-2 text-body-md text-on-surface-variant">
                    {isVi ? desc.vi : desc.en}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="fade-in-up stagger-2 mt-8 flex items-start gap-3 rounded-2xl border border-border bg-background p-6">
            <BadgeCheck className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden="true" />
            <p className="text-body-md text-on-surface-variant">
              {isVi
                ? "Thông tin tài khoản bạn cung cấp khi đặt lịch (họ tên, số điện thoại, địa chỉ) chỉ được dùng để liên hệ và phục vụ sửa chữa, không chia sẻ cho bên thứ ba vì mục đích quảng cáo."
                : "The account details you provide when booking (name, phone, address) are used only to contact you and serve the repair — never shared with third parties for advertising."}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border bg-background py-16">
        <div className="relative mx-auto flex max-w-container-max flex-col items-center justify-between gap-6 px-margin-mobile text-center md:flex-row md:px-margin-desktop md:text-left">
          <div>
            <h2 className="text-headline-sm text-on-surface">
              {isVi ? "Yên tâm đặt lịch cùng FixNow" : "Book with peace of mind"}
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              {isVi
                ? "Bảo hành rõ ràng, dữ liệu an toàn — kỹ thuật viên sẽ liên hệ xác nhận trong giờ làm việc."
                : "Clear warranty, safe data — a technician will contact you during working hours to confirm."}
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
