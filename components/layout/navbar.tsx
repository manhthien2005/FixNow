import Link from "next/link";
import {
  CalendarPlus,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { NavLinks } from "./nav-links";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function Navbar() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const displayName = user?.name ?? dictionary.common.account;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-container-lowest/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between gap-3 px-margin-mobile md:h-20 md:px-margin-desktop">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label={dictionary.common.homeAria}
        >
          <BrandLogo size="md" priority />
        </Link>

        <NavLinks
          variant="desktop"
          className="glass-panel hidden items-center gap-6 rounded-full px-6 py-3 xl:flex"
        />

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden text-on-surface hover:bg-surface-container-high md:inline-flex" />
          <ThemeToggle className="hidden text-on-surface hover:bg-surface-container-high md:inline-flex" />

          <Link
            href="/booking"
            className="btn-gradient glow-cta hidden items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold text-white md:inline-flex"
          >
            <CalendarPlus className="size-4" />
            {dictionary.common.booking}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden max-w-44 gap-1 text-on-surface hover:bg-surface-container-high md:inline-flex"
                >
                  <span className="truncate">{displayName}</span>
                  <ChevronDown className="size-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <LayoutDashboard className="size-4" />
                        {dictionary.common.admin}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/my-appointments">
                    <ClipboardList className="size-4" />
                    {dictionary.common.myAppointments}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <UserRound className="size-4" />
                    {dictionary.common.account}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={logoutAction}>
                  <DropdownMenuItem asChild>
                    <button
                      type="submit"
                      className="w-full cursor-pointer text-left"
                    >
                      <LogOut className="size-4" />
                      {dictionary.common.logout}
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="ghost"
              className="hidden text-on-surface hover:bg-surface-container-high md:inline-flex"
            >
              <Link href="/login">{dictionary.common.login}</Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 text-on-surface hover:bg-surface-container-high xl:hidden"
                aria-label={dictionary.common.openMenu}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-72 flex-col gap-0 border-border bg-surface-container-lowest sm:w-80"
            >
              <SheetTitle className="flex items-center">
                <BrandLogo size="sm" />
              </SheetTitle>

              <NavLinks variant="mobile" className="mt-6 flex flex-col gap-1" />

              <div className="my-4 h-px bg-border" />

              <div className="mb-3 flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-on-surface-variant">
                  {dictionary.common.language}
                </span>
                <LanguageToggle className="text-on-surface hover:bg-surface-container-high" />
              </div>

              <div className="mb-3 flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-on-surface-variant">
                  {dictionary.common.theme}
                </span>
                <ThemeToggle className="text-on-surface hover:bg-surface-container-high" />
              </div>

              <SheetClose asChild>
                <Link
                  href="/booking"
                  className="btn-gradient flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white"
                >
                  <CalendarPlus className="size-4" />
                  {dictionary.common.booking}
                </Link>
              </SheetClose>

              <div className="my-4 h-px bg-border" />

              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-on-surface-variant">
                    {dictionary.common.hello},{" "}
                    <span className="font-medium text-on-surface">
                      {displayName}
                    </span>
                  </p>
                  {isAdmin && (
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant="ghost"
                        className="h-11 justify-start hover:bg-surface-container-high"
                      >
                        <Link href="/admin">
                          <LayoutDashboard className="size-4" />
                          {dictionary.common.admin}
                        </Link>
                      </Button>
                    </SheetClose>
                  )}
                  <SheetClose asChild>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-11 justify-start hover:bg-surface-container-high"
                    >
                      <Link href="/my-appointments">
                        <ClipboardList className="size-4" />
                        {dictionary.common.myAppointments}
                      </Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      asChild
                      variant="ghost"
                      className="h-11 justify-start hover:bg-surface-container-high"
                    >
                      <Link href="/account">
                        <UserRound className="size-4" />
                        {dictionary.common.account}
                      </Link>
                    </Button>
                  </SheetClose>
                  <form action={logoutAction}>
                    <Button
                      type="submit"
                      variant="outline"
                      className="h-11 w-full justify-start"
                    >
                      <LogOut className="size-4" />
                      {dictionary.common.logout}
                    </Button>
                  </form>
                </div>
              ) : (
                <SheetClose asChild>
                  <Button asChild variant="outline" className="h-11 w-full">
                    <Link href="/login">{dictionary.common.login}</Link>
                  </Button>
                </SheetClose>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
