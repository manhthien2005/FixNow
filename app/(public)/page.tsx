import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarClock,
  ChevronRight,
  CreditCard,
  Laptop,
  MapPin,
  Monitor,
  Navigation,
  Phone,
  PhoneCall,
  Play,
  Printer,
  Quote,
  Send,
  Star,
  StarHalf,
  Wrench,
} from "lucide-react";

import { AnimatedCounter } from "@/components/features/home/animated-counter";
import { ScrollReveal } from "@/components/features/home/scroll-reveal";
import { Marquee } from "@/components/features/home/marquee";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { SITE, mapDirectionsHref, mapEmbedSrc } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "FixNow — đặt lịch sửa laptop, PC và thiết bị văn phòng tận nơi. Kiểm tra rõ lỗi, báo giá trước khi sửa.",
};

// Faint dotted grid texture (inline so there are no external image requests).
const GRID_BG = {
  backgroundImage:
    "radial-gradient(circle, rgb(var(--md-outline-variant) / 0.45) 1px, transparent 1px)",
} as const;

// Faint line-grid used as a section backdrop to lift content off the page.
const GRID_LINES = {
  backgroundImage:
    "linear-gradient(rgb(var(--md-outline-variant) / 0.35) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--md-outline-variant) / 0.35) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
} as const;

type Accent = "secondary" | "primary" | "tertiary";

// Literal class strings per accent so Tailwind JIT can see them.
const ACCENT: Record<
  Accent,
  { text: string; ring: string; tile: string; hover: string }
> = {
  secondary: {
    text: "text-secondary",
    ring: "bg-secondary/10",
    tile: "text-secondary shadow-[0_0_15px_rgba(93,230,255,0.2)]",
    hover: "group-hover:text-secondary",
  },
  primary: {
    text: "text-primary",
    ring: "bg-primary/10",
    tile: "text-primary shadow-[0_0_15px_rgba(173,198,255,0.2)]",
    hover: "group-hover:text-primary",
  },
  tertiary: {
    text: "text-tertiary",
    ring: "bg-tertiary/10",
    tile: "text-tertiary shadow-[0_0_15px_rgba(208,188,255,0.2)]",
    hover: "group-hover:text-tertiary",
  },
};

const stats = [
  { target: 500, suffix: "+", label: "Lượt hỗ trợ", accent: "secondary" },
  { target: 98, suffix: "%", label: "Khách hài lòng", accent: "primary" },
  { target: 30, suffix: " phút", label: "Phản hồi trong", accent: "tertiary" },
  { target: 7, suffix: " ngày", label: "Bảo hành từ", accent: "secondary" },
] as const;

// Brand logos (uploaded SVGs). Rendered as a uniform monochrome wall so
// every logo stays legible regardless of its source color.
// w/h are intrinsic aspect ratios for next/image; display height is set via CSS.
const brands = [
  { name: "ASUS", src: "/images/asus-4.svg", w: 1068, h: 220 },
  { name: "Apple", src: "/images/apple-13.svg", w: 271, h: 315 },
  { name: "Dell", src: "/images/dell-2.svg", w: 464, h: 462 },
  { name: "NVIDIA", src: "/images/nvidia-wordmark-1.svg", w: 946, h: 180 },
  { name: "Canon", src: "/images/canon-wordmark-1.svg", w: 800, h: 167 },
  { name: "Lenovo", src: "/images/lenovo-2.svg", w: 1063, h: 156 },
  { name: "Intel", src: "/images/intel.svg", w: 570, h: 376 },
  { name: "Acer", src: "/images/acer-2011.svg", w: 418, h: 100 },
  { name: "AMD", src: "/images/amd-logo-1.svg", w: 800, h: 191 },
] as const;

const services = [
  {
    icon: Laptop,
    image: "/images/service-laptop.jpg",
    title: "Sửa chữa Laptop & MacBook",
    description:
      "Kiểm tra máy không lên nguồn, nóng, chậm, lỗi màn hình, pin hoặc bàn phím. Báo rõ lỗi trước khi sửa.",
    accent: "secondary",
  },
  {
    icon: Monitor,
    image: "/images/service-pc.jpg",
    title: "Build & sửa PC Desktop",
    description:
      "Xử lý PC không lên, treo máy, xanh màn hình, vệ sinh thùng máy và tư vấn nâng cấp phù hợp nhu cầu.",
    accent: "primary",
  },
  {
    icon: Printer,
    image: "/images/service-printer.jpg",
    title: "Bảo trì máy in & thiết bị VP",
    description:
      "Sửa lỗi kẹt giấy, hộp mực, kết nối máy in, wifi và các thiết bị văn phòng nhỏ tại nhà hoặc công ty.",
    accent: "tertiary",
  },
  {
    icon: Wrench,
    image: "/images/service-software.jpg",
    title: "Phần mềm & hỗ trợ từ xa",
    description:
      "Cài Windows, driver, phần mềm học tập/làm việc, diệt virus và hỗ trợ từ xa khi không cần đến tận nơi.",
    accent: "secondary",
  },
] as const;

const reviews = [
  {
    initials: "MA",
    name: "Minh Anh",
    role: "Nhân viên văn phòng",
    rating: 5,
    text: "Laptop của mình bị sập nguồn giữa giờ làm. FixNow gọi lại nhanh, kiểm tra tại nhà và nói rõ máy bị gì trước khi sửa. Chi phí đúng như đã báo.",
  },
  {
    initials: "TH",
    name: "Trần Hải",
    role: "Chủ shop online",
    rating: 5,
    text: "Máy bàn của shop hay treo, mình không rành phần cứng nên khá lo. Kỹ thuật viên giải thích dễ hiểu, vệ sinh lại máy và thay SSD, chạy ổn hơn hẳn.",
  },
  {
    initials: "LN",
    name: "Lê Nam",
    role: "Sinh viên",
    rating: 4.5,
    text: "Mình đặt lịch để cài lại Windows và phần mềm học. Làm xong có hướng dẫn cách giữ dữ liệu và dọn máy định kỳ. Giá rõ ràng, không phát sinh bất ngờ.",
  },
];

const steps = [
  { n: "01", icon: CalendarClock, image: "/images/step-1-booking.jpg", title: "Gửi yêu cầu", description: "Nhập thông tin máy, lỗi gặp phải và thời gian bạn muốn hẹn." },
  { n: "02", icon: PhoneCall, image: "/images/step-2-confirm.jpg", title: "FixNow xác nhận", description: "Kỹ thuật viên gọi lại để hỏi thêm tình trạng và chốt lịch." },
  { n: "03", icon: Wrench, image: "/images/step-3-repair.jpg", title: "Kiểm tra & báo giá", description: "Máy được kiểm tra trước, báo giá rõ ràng rồi mới sửa." },
  { n: "04", icon: CreditCard, image: "/images/step-4-payment.jpg", title: "Nghiệm thu", description: "Bạn kiểm tra lại máy, nhận bảo hành và thanh toán sau cùng." },
];

export default async function HomePage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const home = dictionary.home;
  const isVi = locale === "vi";
  const localizedStats = stats.map((stat, index) => {
    const english = [
      { suffix: "+", label: "Support cases" },
      { suffix: "%", label: "Customer satisfaction" },
      { suffix: " min", label: "Response within" },
      { suffix: " days", label: "Warranty from" },
    ][index];
    return isVi || !english ? stat : { ...stat, ...english };
  });
  const localizedServices = isVi
    ? services
    : [
        {
          ...services[0],
          title: "Laptop & MacBook repair",
          description:
            "Diagnosis for no power, overheating, slow performance, display, battery, or keyboard issues. You get a clear explanation before any repair.",
        },
        {
          ...services[1],
          title: "Desktop PC repair & builds",
          description:
            "Support for PCs that will not boot, freeze, blue-screen, need cleaning, or require practical upgrade advice.",
        },
        {
          ...services[2],
          title: "Printer & office device maintenance",
          description:
            "Fix paper jams, toner issues, printer connection problems, Wi-Fi setup, and small office devices at home or at work.",
        },
        {
          ...services[3],
          title: "Software & remote support",
          description:
            "Windows, drivers, study/work apps, malware cleanup, and remote support when an on-site visit is not needed.",
        },
      ];
  const localizedReviews = isVi
    ? reviews
    : [
        {
          initials: "MA",
          name: "Minh Anh",
          role: "Office employee",
          rating: 5,
          text: "My laptop shut down in the middle of work. FixNow called back quickly, checked it at home, and explained the issue before repairing it. The cost matched the quote.",
        },
        {
          initials: "TH",
          name: "Tran Hai",
          role: "Online shop owner",
          rating: 5,
          text: "The shop PC kept freezing and I was worried because I do not know much about hardware. The technician explained everything clearly, cleaned the PC, replaced the SSD, and it runs much better.",
        },
        {
          initials: "LN",
          name: "Le Nam",
          role: "Student",
          rating: 4.5,
          text: "I booked a Windows reinstall and study apps setup. After finishing, they showed me how to protect data and keep the machine clean. Pricing was clear with no surprise extras.",
        },
      ];
  const localizedSteps = isVi
    ? steps
    : [
        {
          ...steps[0],
          title: "Send a request",
          description:
            "Enter your device information, the issue, and your preferred time.",
        },
        {
          ...steps[1],
          title: "FixNow confirms",
          description:
            "A technician calls back to ask for more details and confirm the appointment.",
        },
        {
          ...steps[2],
          title: "Inspect & quote",
          description:
            "The device is checked first, then you receive a clear quote before repair.",
        },
        {
          ...steps[3],
          title: "Review & pay",
          description:
            "You check the device, receive warranty notes, and pay at the end.",
        },
      ];

  return (
    <>
      <ScrollReveal />

      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-background pt-12 md:pt-16">
        <div aria-hidden className="absolute inset-0 z-0">
          <div className="hero-mask absolute inset-0 scale-110 opacity-50 mix-blend-luminosity">
            <Image
              src="/images/hero.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.5] contrast-125"
            />
          </div>
          <div className="absolute right-[10%] top-[18%] h-[600px] w-[600px] rounded-full bg-secondary/10 blur-[150px]" />
          <div className="absolute bottom-0 left-[15%] h-[400px] w-[700px] rounded-full bg-primary/10 blur-[150px]" />
          <div className="absolute inset-0 opacity-30" style={GRID_BG} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        {/* Floating service notes */}
        <div
          aria-hidden
          className="glass-panel-heavy absolute right-[8%] top-[26%] z-10 hidden animate-drift rounded-lg border-l-2 border-l-secondary p-4 font-mono text-label-sm text-secondary/70 lg:block"
        >
          <p>{isVi ? "Nhận lịch trong ngày" : "Same-day scheduling"}</p>
          <p>{isVi ? "Báo giá trước khi sửa" : "Quote before repair"}</p>
          <p className="animate-pulse">
            {isVi ? "Theo dõi bằng mã hẹn" : "Track by appointment code"}
          </p>
        </div>
        <div
          aria-hidden
          className="glass-panel-heavy absolute bottom-[16%] right-[18%] z-10 hidden animate-drift rounded-lg p-3 font-mono text-label-sm text-primary/70 [animation-delay:-5s] lg:block"
        >
          <p>Hotline: {SITE.hotline.label}</p>
          <p>{isVi ? "Zalo hỗ trợ nhanh" : "Fast Zalo support"}</p>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="flex max-w-3xl flex-col gap-8">
            <div className="glass-panel-heavy inline-flex w-max items-center gap-3 rounded-full border-secondary/30 px-5 py-2.5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary" />
              </span>
              <span className="font-mono text-label-sm uppercase tracking-[0.2em] text-on-surface">
                {isVi ? "Đang nhận lịch hôm nay" : "Taking bookings today"}
              </span>
            </div>

            <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
              {home.title}
              <br />
              <span className="text-gradient">{home.subtitle}</span>
            </h1>

            <p className="max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
              {home.description}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-5">
              <Link
                href="/booking"
                className="btn-gradient glow-cta group relative flex items-center gap-3 rounded-full px-9 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
              >
                <span>{home.primaryCta}</span>
                <Phone className="icon-phone-ring size-5" />
              </Link>
              <Link
                href="/services"
                className="group flex items-center gap-3 font-mono text-label-md uppercase tracking-wider text-on-surface transition-colors hover:text-secondary"
              >
                <span className="glass-panel flex size-12 items-center justify-center rounded-full transition-colors group-hover:bg-surface-container-high">
                  <Play className="size-5" />
                </span>
                {isVi ? "Xem dịch vụ" : "View services"}
              </Link>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 opacity-50"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
            {isVi ? "Cuộn xuống" : "Scroll down"}
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-secondary to-transparent" />
        </div>
      </section>

      {/* Stats — mission dashboard */}
      <section className="scanlines relative overflow-hidden border-y border-border bg-surface-container-lowest py-20">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up mb-12 text-center">
            <p className="mb-2 font-mono text-label-sm uppercase tracking-widest text-secondary">
              {isVi ? "DỊCH VỤ TẬN NƠI" : "ON-SITE SERVICE"}
            </p>
            <h2 className="text-headline-sm text-on-surface">
              {home.trustTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {localizedStats.map((stat, i) => {
              const a = ACCENT[stat.accent];
              return (
                <div
                  key={stat.label}
                  className={`glass-panel-heavy fade-in-up stagger-${i} group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl p-8 text-center`}
                >
                  <div
                    className={`absolute right-0 top-0 -z-10 h-16 w-16 rounded-bl-full transition-transform duration-500 group-hover:scale-150 ${a.ring}`}
                  />
                  <span className="mb-2 text-display-lg font-bold text-on-surface">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </span>
                  <span
                    className={`font-mono text-label-sm uppercase tracking-wider ${a.text}`}
                  >
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand logo wall — uniform white monochrome, real uploaded SVGs */}
        <div className="fade-in-up stagger-4 mt-16 border-t border-border pt-8">
          <p className="mb-8 text-center font-mono text-label-sm uppercase tracking-widest text-on-surface-variant/70">
            {isVi
              ? "Hỗ trợ nhiều dòng máy và thương hiệu phổ biến"
              : "Support for popular device lines and brands"}
          </p>
          <Marquee durationSeconds={34} className="gap-16 px-8" fadeClassName="w-24">
            {brands.map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex h-10 shrink-0 items-center opacity-60 transition-all duration-500 hover:opacity-100"
                title={brand.name}
              >
                <Image
                  src={brand.src}
                  alt={`Logo ${brand.name}`}
                  width={brand.w}
                  height={brand.h}
                  className="h-full w-auto brightness-0 opacity-70 dark:invert"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Interactive service tree */}
      <section id="dich-vu" className="relative overflow-hidden bg-background py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
          style={GRID_LINES}
        />
        <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up mx-auto mb-16 max-w-3xl text-center md:mb-24">
            <p className="mb-4 font-mono text-label-sm uppercase tracking-widest text-secondary">
              {isVi ? "DỊCH VỤ CHÍNH" : "CORE SERVICES"}
            </p>
            <h2 className="mb-6 text-display-lg-mobile text-on-surface md:text-display-lg">
              {home.simpleTitle}
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              {home.simpleText}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-5xl py-10">
            <div className="tree-line hidden md:block">
              <div className="tree-progress" />
            </div>

            <div className="relative space-y-12 md:space-y-24">
              {localizedServices.map((service, i) => {
                const a = ACCENT[service.accent];
                const Icon = service.icon;
                const isLeft = i % 2 === 0;
                const card = (
                  <div className="glass-panel tree-card group rounded-2xl p-8 text-left">
                    <div
                      className={`mb-6 flex size-14 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 ${a.tile}`}
                    >
                      <Icon className="size-7" />
                    </div>
                    <h3
                      className={`mb-3 text-headline-sm text-on-surface transition-colors ${a.hover}`}
                    >
                      {service.title}
                    </h3>
                    <p className="mb-6 text-body-md text-on-surface-variant">
                      {service.description}
                    </p>
                    <Link
                      href="/services"
                      className={`inline-flex items-center gap-2 font-mono text-label-md uppercase tracking-wider ${a.text}`}
                    >
                      {isVi ? "Xem chi tiết" : "View details"}{" "}
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                );
                const visual = (
                  <div className="glass-panel tree-card group/img relative hidden aspect-video overflow-hidden rounded-2xl md:block">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/30 via-transparent to-transparent" />
                  </div>
                );
                return (
                  <div
                    key={service.title}
                    className="fade-in-up relative flex w-full flex-col items-center md:flex-row"
                  >
                    {isLeft ? (
                      <>
                        <div className="relative w-full md:w-1/2 md:pr-14">
                          <div className="absolute right-0 top-1/2 hidden h-px w-6 bg-outline-variant md:block" />
                          {card}
                        </div>
                        <div className="tree-node active absolute left-1/2 hidden md:block" />
                        <div className="hidden w-1/2 md:block md:pl-14">{visual}</div>
                      </>
                    ) : (
                      <>
                        <div className="hidden w-1/2 md:block md:pr-14">{visual}</div>
                        <div className="tree-node active absolute left-1/2 hidden md:block" />
                        <div className="relative mt-6 w-full md:mt-0 md:w-1/2 md:pl-14">
                          <div className="absolute left-0 top-1/2 hidden h-px w-6 bg-outline-variant md:block" />
                          {card}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section
        id="danh-gia"
        className="overflow-hidden border-y border-border bg-surface-container-lowest py-24"
      >
        <div className="fade-in-up mx-auto mb-12 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <p className="mb-4 font-mono text-label-sm uppercase tracking-widest text-secondary">
            {isVi ? "KHÁCH HÀNG CHIA SẺ" : "CUSTOMER STORIES"}
          </p>
          <h2 className="text-headline-md text-on-surface">
            {isVi
              ? "Trải nghiệm thực tế khi gọi FixNow"
              : "Real experiences with FixNow"}
          </h2>
        </div>

        <div className="mx-auto mb-12 flex max-w-container-max flex-col gap-12 px-margin-mobile md:px-margin-desktop lg:flex-row">
          {/* Left: team image + rating summary */}
          <div className="fade-in-up w-full lg:w-1/3">
            <div className="glass-panel relative h-full min-h-[280px] overflow-hidden rounded-2xl">
              <Image
                src="/images/team.jpg"
                alt="Đội ngũ kỹ thuật viên FixNow"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-8">
                <div className="flex items-end gap-3">
                  <p className="text-display-lg-mobile font-bold text-on-surface">
                    4.9
                  </p>
                  <div className="mb-2 flex gap-1 text-secondary">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="size-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant">
                  {isVi
                    ? "Điểm đánh giá trung bình từ khách đã đặt lịch sửa chữa và bảo trì thiết bị qua FixNow."
                    : "Average rating from customers who booked repair and maintenance through FixNow."}
                </p>
                <Link
                  href="/booking"
                  className="btn-gradient glow-cta mt-2 inline-flex w-max items-center gap-2 rounded-lg px-6 py-3 font-mono text-label-md font-bold uppercase tracking-wider text-white"
                >
                  {isVi ? "Đặt lịch sửa máy" : "Book a repair"}{" "}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: auto-scrolling review slider */}
          <div className="fade-in-up stagger-1 w-full lg:w-2/3">
            <Marquee durationSeconds={40} fadeClassName="w-16">
              {localizedReviews.map((r, i) => (
                <article
                  key={`${r.initials}-${i}`}
                  className="glass-panel relative w-[300px] shrink-0 rounded-2xl p-8 sm:w-[380px]"
                >
                  <Quote className="absolute right-6 top-6 size-9 text-outline-variant/40" />
                  <div className="mb-6 flex gap-1 text-secondary">
                    {Array.from({ length: Math.floor(r.rating) }).map((_, s) => (
                      <Star key={s} className="size-5 fill-current" />
                    ))}
                    {r.rating % 1 !== 0 && (
                      <StarHalf className="size-5 fill-current" />
                    )}
                  </div>
                  <p className="mb-6 text-body-md italic text-on-surface-variant">
                    {r.text}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full border border-border bg-surface-container-high font-bold text-on-surface">
                      {r.initials}
                    </div>
                    <div>
                      <p className="text-label-md text-on-surface">{r.name}</p>
                      <p className="font-mono text-label-sm text-on-surface-variant">
                        {r.role}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Booking CTA (links to the full /booking form) */}
      <section id="dat-lich" className="relative bg-background py-24">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up mb-16 text-center">
            <p className="mb-4 font-mono text-label-sm uppercase tracking-widest text-secondary">
              {isVi ? "ĐẶT LỊCH DỄ DÀNG" : "EASY BOOKING"}
            </p>
            <h2 className="text-headline-md text-on-surface">
              {home.processTitle}
            </h2>
          </div>

          <div className="fade-in-up stagger-1 mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {localizedSteps.map((step, i) => {
              return (
                <div
                  key={step.n}
                  className="group relative flex flex-col items-center text-center"
                >
                  <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl border border-border">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(min-width: 768px) 22vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/85 via-surface-container-lowest/20 to-transparent" />
                    <span className="btn-gradient absolute -left-2 -top-2 z-10 inline-flex size-12 items-center justify-center rounded-lg font-mono text-xl font-bold leading-none text-white shadow-[0_0_18px_rgba(0,203,230,0.45)]">
                      {step.n}
                    </span>
                  </div>
                  <h3 className="mb-2 text-headline-sm text-on-surface">
                    {step.title}
                  </h3>
                  <p className="mx-auto max-w-[220px] text-body-md text-on-surface-variant">
                    {step.description}
                  </p>
                  {i < steps.length - 1 && (
                    <ChevronRight className="absolute -right-4 top-[4.5rem] hidden size-7 text-secondary md:block lg:-right-6" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="glass-panel-heavy fade-in-up stagger-2 relative mx-auto max-w-3xl overflow-hidden rounded-3xl p-8 text-center md:p-12">
            <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-bl-full bg-secondary/10" />
            <div className="absolute bottom-0 left-0 -z-10 h-32 w-32 rounded-tr-full bg-primary/10" />
            <h3 className="text-headline-sm text-on-surface md:text-headline-md">
              {home.finalTitle}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-body-md text-on-surface-variant">
              {home.finalText}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/booking"
                className="btn-gradient glow-cta group flex items-center gap-2 rounded-xl px-9 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
              >
                <span>{home.finalCta}</span>
                <Send className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="font-mono text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-secondary"
              >
                {isVi ? "Xem bảng giá trước" : "View pricing first"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact + stylized service-area map */}
      <section id="lien-he" className="relative bg-background py-24">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="fade-in-up">
            <p className="mb-4 font-mono text-label-sm uppercase tracking-widest text-secondary">
                {isVi ? "KHU VỰC PHỤC VỤ" : "SERVICE AREA"}
              </p>
              <h2 className="mb-6 text-headline-md text-on-surface">
                {isVi ? "FixNow phục vụ tận nơi" : "FixNow comes to you"}
              </h2>
              <p className="mb-8 text-body-md text-on-surface-variant">
                {isVi
                  ? "Bạn có thể đặt lịch để kỹ thuật viên đến nhà, văn phòng hoặc mang máy đến điểm hỗ trợ của FixNow trong khu vực nội thành."
                  : "Book a technician for your home or office, or bring your device to the FixNow support point in the city area."}
              </p>

              <div className="mb-10 space-y-6">
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-container-high text-secondary">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">
                      {isVi ? "Điểm hỗ trợ" : "Support point"}
                    </p>
                    <p className="text-body-md text-on-surface-variant">
                      {SITE.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-container-high text-secondary">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">
                      Hotline
                    </p>
                    <p className="font-mono text-body-md text-on-surface-variant">
                      {SITE.hotline.label} · Zalo 24/7
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-container-high text-secondary">
                    <Navigation className="size-5" />
                  </span>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">
                      {isVi ? "Phạm vi phục vụ" : "Service coverage"}
                    </p>
                    <p className="text-body-md text-on-surface-variant">
                      {isVi
                        ? "Tận nơi trong bán kính 3-5km nội thành"
                        : "On-site support within a 3-5km city radius"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={mapDirectionsHref()}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gradient glow-cta inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
                >
                  <Navigation className="size-5" />
                  {isVi ? "Chỉ đường" : "Directions"}
                </a>
                <Link
                  href="/contact"
                  className="glass-panel inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  {isVi ? "Xem trang liên hệ" : "View contact page"}
                </Link>
              </div>
            </div>

            <div className="glass-panel-heavy fade-in-up stagger-1 relative h-[360px] overflow-hidden rounded-2xl p-2 md:h-[400px]">
              <iframe
                title={`${isVi ? "Bản đồ" : "Map"} FixNow - ${SITE.address}`}
                src={mapEmbedSrc()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full rounded-xl border-0 grayscale-[0.3] [color-scheme:light]"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
