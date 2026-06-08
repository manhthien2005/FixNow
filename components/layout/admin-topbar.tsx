import Link from "next/link";
import {
  ChevronDown,
  ClipboardList,
  Cpu,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Tag,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth-actions";
import { Badge } from "@/components/ui/badge";
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
import { BrandLogo } from "@/components/layout/brand-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function AdminTopbar() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const session = await auth();
  const displayName = session?.user?.name ?? dictionary.labels.role.ADMIN;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex min-w-0 items-center"
            aria-label="FixNow Admin"
          >
            <BrandLogo size="sm" />
          </Link>
          <Badge variant="default" className="uppercase tracking-wide">
            Admin
          </Badge>
        </div>

        <nav
          aria-label={dictionary.adminNav.aria}
          className="hidden items-center gap-2 md:flex"
        >
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <LayoutDashboard className="size-4" />
              {dictionary.adminNav.dashboard}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/appointments">
              <ClipboardList className="size-4" />
              {dictionary.adminNav.appointments}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/parts">
              <Cpu className="size-4" />
              {dictionary.adminNav.parts}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/services">
              <Tag className="size-4" />
              {dictionary.adminNav.services}
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden md:inline-flex" />
          <ThemeToggle className="hidden md:inline-flex" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hidden max-w-44 gap-1 md:inline-flex"
              >
                <span className="truncate">{displayName}</span>
                <ChevronDown className="size-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/">
                  <Home className="size-4" />
                  {dictionary.common.backHome}
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

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 md:hidden"
                aria-label={dictionary.common.openAdminMenu}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-72 flex-col gap-0 sm:w-80"
            >
              <SheetTitle className="flex items-center gap-2">
                <BrandLogo size="sm" />
                <Badge variant="default" className="uppercase tracking-wide">
                  Admin
                </Badge>
              </SheetTitle>

              <div className="mt-4 flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-muted-foreground">
                  {dictionary.common.language}
                </span>
                <LanguageToggle />
              </div>

              <div className="mt-3 flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-muted-foreground">
                  {dictionary.common.theme}
                </span>
                <ThemeToggle />
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {dictionary.common.hello},{" "}
                <span className="font-medium text-foreground">
                  {displayName}
                </span>
              </p>

              <div className="my-4 h-px bg-border" />

              <nav className="flex flex-col gap-1">
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/admin">
                      <LayoutDashboard className="size-4" />
                      {dictionary.adminNav.dashboard}
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/admin/appointments">
                      <ClipboardList className="size-4" />
                      {dictionary.adminNav.appointments}
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/admin/parts">
                      <Cpu className="size-4" />
                      {dictionary.adminNav.parts}
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/admin/services">
                      <Tag className="size-4" />
                      {dictionary.adminNav.services}
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 justify-start"
                  >
                    <Link href="/">
                      <Home className="size-4" />
                      {dictionary.common.backHome}
                    </Link>
                  </Button>
                </SheetClose>
              </nav>

              <div className="my-4 h-px bg-border" />

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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
