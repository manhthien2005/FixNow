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

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "FixNow — đặt lịch sửa laptop, PC và thiết bị văn phòng tận nơi. Kiểm tra rõ lỗi, báo giá trước khi sửa.",
};

// Faint dotted grid texture (inline so there are no external image requests).
const GRID_BG = {
  backgroundImage:
    'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=")',
} as const;

// Faint white line-grid used as a section backdrop to lift content off the page.
const GRID_LINES = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
} as const;

// FixNow service location — EDIT THESE 2 LINES with your real address.
// FIXNOW_ADDRESS is shown to users; FIXNOW_MAP_QUERY drives the Google Maps embed
// (a place name or full address both work, no API key required).
const FIXNOW_ADDRESS =
  "123 Đường Công Nghệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh";
const FIXNOW_MAP_QUERY = "Quận 1, Hồ Chí Minh";
const FIXNOW_MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  FIXNOW_MAP_QUERY,
)}&z=14&output=embed`;

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

// Brand logos (uploaded SVGs). Rendered as a uniform white monochrome wall so
// every logo stays legible on the dark theme regardless of its source color.
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

export default function HomePage() {
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
          <p>Nhận lịch trong ngày</p>
          <p>Báo giá trước khi sửa</p>
          <p className="animate-pulse">Theo dõi bằng mã hẹn</p>
        </div>
        <div
          aria-hidden
          className="glass-panel-heavy absolute bottom-[16%] right-[18%] z-10 hidden animate-drift rounded-lg p-3 font-mono text-label-sm text-primary/70 [animation-delay:-5s] lg:block"
        >
          <p>Hotline: 1900 8888</p>
          <p>Zalo hỗ trợ nhanh</p>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="flex max-w-3xl flex-col gap-8">
            <div className="glass-panel-heavy inline-flex w-max items-center gap-3 rounded-full border-secondary/30 px-5 py-2.5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary" />
              </span>
              <span className="font-mono text-label-sm uppercase tracking-[0.2em] text-on-surface">
                Đang nhận lịch hôm nay
              </span>
            </div>

            <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
              FixNow
              <br />
              <span className="text-gradient">
                Đồng hành cùng mọi thiết bị của bạn.
              </span>
            </h1>

            <p className="max-w-xl text-body-lg leading-relaxed text-on-surface-variant">
              Một nền tảng giúp việc sửa chữa thiết bị công nghệ trở nên đơn
              giản, minh bạch và thuận tiện hơn bao giờ hết.
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-5">
              <Link
                href="/booking"
                className="btn-gradient glow-cta group relative flex items-center gap-3 rounded-full px-9 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
              >
                <span>Đặt lịch ngay</span>
                <Phone className="icon-phone-ring size-5" />
              </Link>
              <Link
                href="/services"
                className="group flex items-center gap-3 font-mono text-label-md uppercase tracking-wider text-on-surface transition-colors hover:text-secondary"
              >
                <span className="glass-panel flex size-12 items-center justify-center rounded-full transition-colors group-hover:bg-white/10">
                  <Play className="size-5" />
                </span>
                Xem dịch vụ
              </Link>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 opacity-50"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
            Cuộn xuống
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-secondary to-transparent" />
        </div>
      </section>

      {/* Stats — mission dashboard */}
      <section className="scanlines relative overflow-hidden border-y border-white/5 bg-surface-container-lowest py-20">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="fade-in-up mb-12 text-center">
            <p className="mb-2 font-mono text-label-sm uppercase tracking-widest text-secondary">
              DỊCH VỤ TẬN NƠI
            </p>
            <h2 className="text-headline-sm text-on-surface">
              Uy tín làm nên thương hiệu.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat, i) => {
              const a = ACCENT[stat.accent];
              return (
                <div
                  key={stat.label}
                  className={`glass-panel-heavy fade-in-up stagger-${i} group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl p-8 text-center`}
                >
                  <div
                    className={`absolute right-0 top-0 -z-10 h-16 w-16 rounded-bl-full transition-transform duration-500 group-hover:scale-150 ${a.ring}`}
                  />
                  <span className="mb-2 text-display-lg font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
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
        <div className="fade-in-up stagger-4 mt-16 border-t border-white/5 pt-8">
          <p className="mb-8 text-center font-mono text-label-sm uppercase tracking-widest text-on-surface-variant/70">
            Hỗ trợ nhiều dòng máy và thương hiệu phổ biến
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
                  className="h-full w-auto brightness-0 invert"
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
              DỊCH VỤ CHÍNH
            </p>
            <h2 className="mb-6 text-display-lg-mobile text-on-surface md:text-display-lg">
              Giải quyết sự cố công nghệ một cách đơn giản.
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              Hỗ trợ sửa chữa, nâng cấp và tối ưu thiết bị với quy trình rõ
              ràng và thuận tiện.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-5xl py-10">
            <div className="tree-line hidden md:block">
              <div className="tree-progress" />
            </div>

            <div className="relative space-y-12 md:space-y-24">
              {services.map((service, i) => {
                const a = ACCENT[service.accent];
                const Icon = service.icon;
                const isLeft = i % 2 === 0;
                const card = (
                  <div className="glass-panel tree-card group rounded-2xl p-8 text-left">
                    <div
                      className={`mb-6 flex size-14 items-center justify-center rounded-xl border border-white/10 bg-surface-container-high/50 ${a.tile}`}
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
                      Xem chi tiết <ArrowRight className="size-4" />
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
                          <div className="absolute right-0 top-1/2 hidden h-px w-6 bg-white/20 md:block" />
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
                          <div className="absolute left-0 top-1/2 hidden h-px w-6 bg-white/20 md:block" />
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
        className="overflow-hidden border-y border-white/5 bg-surface-container-lowest py-24"
      >
        <div className="fade-in-up mx-auto mb-12 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <p className="mb-4 font-mono text-label-sm uppercase tracking-widest text-secondary">
            KHÁCH HÀNG CHIA SẺ
          </p>
          <h2 className="text-headline-md text-on-surface">
            Trải nghiệm thực tế khi gọi FixNow
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
                  <p className="text-display-lg-mobile font-bold text-white">4.9</p>
                  <div className="mb-2 flex gap-1 text-secondary">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="size-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant">
                  Điểm đánh giá trung bình từ khách đã đặt lịch sửa chữa và
                  bảo trì thiết bị qua FixNow.
                </p>
                <Link
                  href="/booking"
                  className="btn-gradient glow-cta mt-2 inline-flex w-max items-center gap-2 rounded-lg px-6 py-3 font-mono text-label-md font-bold uppercase tracking-wider text-white"
                >
                  Đặt lịch sửa máy <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right: auto-scrolling review slider */}
          <div className="fade-in-up stagger-1 w-full lg:w-2/3">
            <Marquee durationSeconds={40} fadeClassName="w-16">
              {reviews.map((r, i) => (
                <article
                  key={`${r.initials}-${i}`}
                  className="glass-panel relative w-[300px] shrink-0 rounded-2xl p-8 sm:w-[380px]"
                >
                  <Quote className="absolute right-6 top-6 size-9 text-white/5" />
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
                    <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-surface-container-high font-bold text-on-surface">
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
              ĐẶT LỊCH DỄ DÀNG
            </p>
            <h2 className="text-headline-md text-on-surface">
              Quy trình làm việc rõ ràng
            </h2>
          </div>

          <div className="fade-in-up stagger-1 mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((step, i) => {
              return (
                <div
                  key={step.n}
                  className="group relative flex flex-col items-center text-center"
                >
                  <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
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
              Cần kỹ thuật viên kiểm tra máy?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-body-md text-on-surface-variant">
              Gửi thông tin lỗi máy, địa chỉ và thời gian thuận tiện. FixNow sẽ
              liên hệ lại để xác nhận trước khi kỹ thuật viên đến nơi.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/booking"
                className="btn-gradient glow-cta group flex items-center gap-2 rounded-xl px-9 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
              >
                <span>Đặt lịch sửa máy</span>
                <Send className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="font-mono text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-secondary"
              >
                Xem bảng giá trước
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
                KHU VỰC PHỤC VỤ
              </p>
              <h2 className="mb-6 text-headline-md text-on-surface">
                FixNow phục vụ tận nơi
              </h2>
              <p className="mb-8 text-body-md text-on-surface-variant">
                Bạn có thể đặt lịch để kỹ thuật viên đến nhà, văn phòng hoặc
                mang máy đến điểm hỗ trợ của FixNow trong khu vực nội thành.
              </p>

              <div className="mb-10 space-y-6">
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface-container-high text-secondary">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">Điểm hỗ trợ</p>
                    <p className="text-body-md text-on-surface-variant">
                      {FIXNOW_ADDRESS}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface-container-high text-secondary">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">Hotline</p>
                    <p className="font-mono text-body-md text-on-surface-variant">
                      1900 8888 · Zalo 24/7
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface-container-high text-secondary">
                    <Navigation className="size-5" />
                  </span>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">Phạm vi phục vụ</p>
                    <p className="text-body-md text-on-surface-variant">
                      Tận nơi trong bán kính 3–5km nội thành
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    FIXNOW_MAP_QUERY,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gradient glow-cta inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-white"
                >
                  <Navigation className="size-5" />
                  Chỉ đường
                </a>
                <Link
                  href="/contact"
                  className="glass-panel inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-mono text-label-md font-bold uppercase tracking-wider text-on-surface transition-colors hover:bg-white/10"
                >
                  Xem trang liên hệ
                </Link>
              </div>
            </div>

            <div className="glass-panel-heavy fade-in-up stagger-1 relative h-[360px] overflow-hidden rounded-2xl p-2 md:h-[400px]">
              <iframe
                title={`Bản đồ FixNow — ${FIXNOW_ADDRESS}`}
                src={FIXNOW_MAP_SRC}
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
