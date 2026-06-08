"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";

export const NAV_ITEMS = [
  { href: "/", label: "Trang chủ" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/parts", label: "Linh kiện" },
  { href: "/contact", label: "Liên hệ" },
  { href: "/track", label: "Tra cứu" },
] as const;

interface NavLinksProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

export function NavLinks({ variant = "desktop", className }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        const link = (
          <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              variant === "desktop"
                ? "relative text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-secondary after:transition-opacity"
                : "flex min-h-11 items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-surface-container-high",
              active
                ? variant === "desktop"
                  ? "text-secondary after:opacity-100"
                  : "text-secondary"
                : variant === "desktop"
                  ? "text-on-surface-variant after:opacity-0 hover:text-on-surface"
                  : "text-on-surface",
            )}
          >
            {item.label}
          </Link>
        );

        return (
          <Fragment key={item.href}>
            {variant === "mobile" ? (
              <SheetClose asChild>{link}</SheetClose>
            ) : (
              link
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
