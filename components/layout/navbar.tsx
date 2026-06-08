import Link from "next/link";
import {
  CalendarPlus,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  Wrench,
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

export async function Navbar() {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const displayName = user?.name ?? "Tài khoản";

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-surface-container-lowest/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between gap-3 px-margin-mobile md:h-20 md:px-margin-desktop">
        <Link
          href="/"
          className="group flex items-center gap-2 text-headline-sm font-bold text-on-surface"
          aria-label="FixNow — về trang chủ"
        >
          <Wrench className="size-6 text-secondary transition-transform duration-500 group-hover:rotate-90" />
          FixNow
        </Link>

        <NavLinks
          variant="desktop"
          className="glass-panel hidden items-center gap-8 rounded-full px-8 py-3 lg:flex"
        />

        <div className="flex items-center gap-2">
          <Link
            href="/booking"
            className="btn-gradient glow-cta hidden items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white md:inline-flex"
          >
            <CalendarPlus className="size-4" />
            Đặt lịch
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
                        Trang admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/my-appointments">
                    <ClipboardList className="size-4" />
                    Lịch hẹn của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <UserRound className="size-4" />
                    Tài khoản
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
                      Đăng xuất
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
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 text-on-surface hover:bg-surface-container-high lg:hidden"
                aria-label="Mở menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-72 flex-col gap-0 border-white/10 bg-surface-container-lowest sm:w-80"
            >
              <SheetTitle className="flex items-center gap-2 text-lg font-bold text-on-surface">
                <Wrench className="size-5 text-secondary" />
                FixNow
              </SheetTitle>

              <NavLinks variant="mobile" className="mt-6 flex flex-col gap-1" />

              <div className="my-4 h-px bg-white/10" />

              <SheetClose asChild>
                <Link
                  href="/booking"
                  className="btn-gradient flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white"
                >
                  <CalendarPlus className="size-4" />
                  Đặt lịch
                </Link>
              </SheetClose>

              <div className="my-4 h-px bg-white/10" />

              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-on-surface-variant">
                    Xin chào,{" "}
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
                          Trang admin
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
                        Lịch hẹn của tôi
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
                        Tài khoản
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
                      Đăng xuất
                    </Button>
                  </form>
                </div>
              ) : (
                <SheetClose asChild>
                  <Button asChild variant="outline" className="h-11 w-full">
                    <Link href="/login">Đăng nhập</Link>
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
