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

export async function Navbar() {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const displayName = user?.name ?? "Tài khoản";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <Link
          href="/"
          className="text-xl font-bold text-primary"
          aria-label="FixNow — về trang chủ"
        >
          FixNow
        </Link>

        <NavLinks
          variant="desktop"
          className="hidden items-center gap-6 md:flex"
        />

        <div className="flex items-center gap-2">
          <Button asChild className="hidden md:inline-flex">
            <Link href="/booking">
              <CalendarPlus className="size-4" />
              Đặt lịch
            </Link>
          </Button>

          {user ? (
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
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 md:hidden"
                aria-label="Mở menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-72 flex-col gap-0 sm:w-80"
            >
              <SheetTitle className="text-lg font-bold text-primary">
                FixNow
              </SheetTitle>

              <NavLinks
                variant="mobile"
                className="mt-6 flex flex-col gap-1"
              />

              <div className="my-4 h-px bg-border" />

              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link href="/booking">
                    <CalendarPlus className="size-4" />
                    Đặt lịch
                  </Link>
                </Button>
              </SheetClose>

              <div className="my-4 h-px bg-border" />

              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    Xin chào,{" "}
                    <span className="font-medium text-foreground">
                      {displayName}
                    </span>
                  </p>
                  {isAdmin && (
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant="ghost"
                        className="h-11 justify-start"
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
                      className="h-11 justify-start"
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
                      className="h-11 justify-start"
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
