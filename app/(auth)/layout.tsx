import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { GridBackdrop } from "@/components/marketing/grid-backdrop";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <GridBackdrop />
      <div aria-hidden className="absolute right-[10%] top-0 h-72 w-72 rounded-full bg-secondary/10 blur-[140px]" />
      <div aria-hidden className="absolute -bottom-10 left-[8%] h-72 w-96 rounded-full bg-primary/10 blur-[150px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-container-max items-center justify-between gap-3 px-margin-mobile py-5 md:px-margin-desktop">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 font-mono text-label-sm uppercase tracking-wider text-on-surface-variant transition-colors hover:text-secondary"
        >
          <ArrowLeft className="size-4" />
          {dictionary.common.backHome}
        </Link>
        <div className="flex items-center gap-2">
          <LanguageToggle className="text-on-surface hover:bg-surface-container-high" />
          <ThemeToggle className="text-on-surface hover:bg-surface-container-high" />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-margin-mobile py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex min-h-11 items-center"
            >
              <BrandLogo size="lg" priority />
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
