import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { BrandLogo } from "@/components/layout/brand-logo";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function Footer() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const serviceRadius =
    locale === "vi" ? SITE.serviceRadius : "3-5km radius within central HCMC";

  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface-container-lowest py-12">
      <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center"
            >
              <BrandLogo size="md" />
            </Link>
            <p className="max-w-xs text-body-md text-on-surface-variant">
              {dictionary.footer.description}
            </p>
          </div>

          <div>
            <h3 className="mb-6 font-mono text-label-md uppercase tracking-widest text-on-surface">
              {dictionary.footer.quickLinks}
            </h3>
            <nav className="flex flex-col gap-3">
              {dictionary.nav.items.map((link) => (
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
              {dictionary.footer.contact}
            </h3>
            <ul className="flex flex-col gap-3 text-body-md text-on-surface-variant">
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-secondary" />
                <a
                  href={SITE.hotline.href}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-secondary"
                >
                  {dictionary.footer.hotline}: {SITE.hotline.label}
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
                  {dictionary.footer.zalo}: {SITE.zalo.label}
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
                <span>
                  {dictionary.footer.serviceArea}: {serviceRadius}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="font-mono text-label-sm text-on-surface-variant">
            © 2026 FixNow.
          </p>
          <p className="text-label-sm text-on-surface-variant">
            {dictionary.footer.promise}
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
