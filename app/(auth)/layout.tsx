import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";

import { GridBackdrop } from "@/components/marketing/grid-backdrop";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <GridBackdrop />
      <div aria-hidden className="absolute right-[10%] top-0 h-72 w-72 rounded-full bg-secondary/10 blur-[140px]" />
      <div aria-hidden className="absolute -bottom-10 left-[8%] h-72 w-96 rounded-full bg-primary/10 blur-[150px]" />

      <header className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile py-5 md:px-margin-desktop">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 font-mono text-label-sm uppercase tracking-wider text-on-surface-variant transition-colors hover:text-secondary"
        >
          <ArrowLeft className="size-4" />
          Về trang chủ
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-margin-mobile py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="group flex min-h-11 items-center gap-2 text-headline-md font-bold text-on-surface"
            >
              <Wrench className="size-7 text-secondary transition-transform duration-500 group-hover:rotate-90" />
              FixNow
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
