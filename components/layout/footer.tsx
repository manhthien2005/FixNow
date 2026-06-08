import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone, Wrench } from "lucide-react";
import { SITE } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/parts", label: "Linh kiện" },
  { href: "/contact", label: "Liên hệ" },
  { href: "/track", label: "Tra cứu" },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-surface-container-lowest py-12">
      <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="group flex items-center gap-2 text-headline-sm font-bold text-on-surface"
            >
              <Wrench className="size-6 text-secondary transition-transform duration-500 group-hover:rotate-90" />
              FixNow
            </Link>
            <p className="max-w-xs text-body-md text-on-surface-variant">
              Sửa chữa &amp; bảo trì laptop/PC tận nơi. Tiện lợi – Minh bạch –
              Nhanh chóng – An toàn dữ liệu.
            </p>
          </div>

          <div>
            <h3 className="mb-6 font-mono text-label-md uppercase tracking-widest text-on-surface">
              Liên kết nhanh
            </h3>
            <nav className="flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-body-md text-on-surface-variant transition-colors hover:text-secondary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-6 font-mono text-label-md uppercase tracking-widest text-on-surface">
              Liên hệ
            </h3>
            <ul className="flex flex-col gap-3 text-body-md text-on-surface-variant">
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-secondary" />
                <a
                  href={SITE.hotline.href}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-secondary"
                >
                  Hotline: {SITE.hotline.label}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="size-4 shrink-0 text-secondary" />
                <a
                  href={SITE.zalo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-secondary"
                >
                  Zalo: {SITE.zalo.label}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-secondary" />
                <a
                  href={SITE.email.href}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-secondary"
                >
                  {SITE.email.label}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-secondary" />
                <span>Khu vực phục vụ: {SITE.serviceRadius}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="font-mono text-label-sm text-on-surface-variant">
            © 2026 FixNow.
          </p>
          <p className="text-label-sm text-on-surface-variant">
            Tiện lợi · Minh bạch · Nhanh chóng · An toàn dữ liệu
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-secondary/5 blur-[100px]"
      />
    </footer>
  );
}
