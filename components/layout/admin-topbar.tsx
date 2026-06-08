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

export async function AdminTopbar() {
  const session = await auth();
  const displayName = session?.user?.name ?? "Quản trị viên";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-bold text-primary md:text-xl"
            aria-label="FixNow Admin"
          >
            FixNow
          </Link>
          <Badge variant="default" className="uppercase tracking-wide">
            Admin
          </Badge>
        </div>

        <nav
          aria-label="Admin navigation"
          className="hidden items-center gap-2 md:flex"
        >
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/appointments">
              <ClipboardList className="size-4" />
              Lịch hẹn
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/parts">
              <Cpu className="size-4" />
              Linh kiện
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/services">
              <Tag className="size-4" />
              Dịch vụ
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
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
                  Về trang chủ
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

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 md:hidden"
                aria-label="Mở menu admin"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-72 flex-col gap-0 sm:w-80"
            >
              <SheetTitle className="flex items-center gap-2 text-lg font-bold text-primary">
                FixNow
                <Badge variant="default" className="uppercase tracking-wide">
                  Admin
                </Badge>
              </SheetTitle>

              <p className="mt-3 text-sm text-muted-foreground">
                Xin chào,{" "}
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
                      Dashboard
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
                      Lịch hẹn
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
                      Linh kiện
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
                      Dịch vụ
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
                      Về trang chủ
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
                  Đăng xuất
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
