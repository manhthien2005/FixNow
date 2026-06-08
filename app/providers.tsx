"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/i18n/language-provider";
import type { Locale } from "@/lib/i18n";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <LanguageProvider locale={locale}>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
