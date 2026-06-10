"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/language-provider";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useI18n();
  const isVi = locale === "vi";

  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-margin-mobile py-20 text-center md:px-margin-desktop">
      <p className="mb-3 font-mono text-label-sm uppercase tracking-widest text-destructive">
        &gt; ERROR
      </p>
      <h1 className="text-display-lg-mobile text-on-surface">
        {isVi ? "Đã xảy ra lỗi" : "Something went wrong"}
      </h1>
      <p className="mt-3 max-w-md text-body-md text-on-surface-variant">
        {isVi
          ? "Hệ thống gặp sự cố không mong muốn. Bạn vui lòng thử lại hoặc quay về trang chủ."
          : "An unexpected error occurred. Please try again or return home."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} className="h-11">
          <RotateCcw className="size-4" aria-hidden="true" />
          {isVi ? "Thử lại" : "Try again"}
        </Button>
        <Button asChild variant="outline" className="h-11">
          <Link href="/">
            <Home className="size-4" aria-hidden="true" />
            {isVi ? "Về trang chủ" : "Back home"}
          </Link>
        </Button>
      </div>
    </main>
  );
}
