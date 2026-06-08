import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

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
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-xl font-bold text-primary">FixNow</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Sửa chữa &amp; bảo trì laptop/PC tận nơi. Tiện lợi – Minh bạch –
              Nhanh chóng – An toàn dữ liệu.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Liên kết nhanh
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Liên hệ
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <a
                  href="tel:+841900xxxx"
                  className="transition-colors hover:text-primary"
                >
                  Hotline: 1900-xxxx
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 shrink-0 text-primary" />
                <a
                  href="https://zalo.me/fixnow"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  Zalo: zalo.me/fixnow
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                <a
                  href="mailto:support@fixnow.vn"
                  className="transition-colors hover:text-primary"
                >
                  support@fixnow.vn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" />
                <span>Khu vực phục vụ: Bán kính 3–5km</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 FixNow. Đồ án sinh viên.
          </p>
        </div>
      </div>
    </footer>
  );
}
