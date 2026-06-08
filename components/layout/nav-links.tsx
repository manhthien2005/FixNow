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
                ? "text-sm font-medium transition-colors hover:text-primary"
                : "flex items-center min-h-11 rounded-md px-3 text-base font-medium transition-colors hover:bg-muted",
              active
                ? "text-primary"
                : variant === "desktop"
                  ? "text-foreground/70"
                  : "text-foreground",
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
