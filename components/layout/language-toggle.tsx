"use client";

import { Languages } from "lucide-react";

import { useI18n } from "@/components/i18n/language-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, dictionary } = useI18n();
  const nextLocale = locale === "vi" ? "en" : "vi";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("h-10 gap-2 px-3", className)}
      aria-label={dictionary.common.language}
      title={dictionary.common.language}
      onClick={() => setLocale(nextLocale)}
    >
      <Languages className="size-4" aria-hidden="true" />
      <span className="font-mono text-xs font-semibold uppercase">
        {locale}
      </span>
    </Button>
  );
}
