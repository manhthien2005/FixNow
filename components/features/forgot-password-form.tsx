"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CircleCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      toast.error("Mật khẩu mới ít nhất 6 ký tự.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        toast.error(data.message ?? "Không thể đặt lại mật khẩu.");
        return;
      }
      setDone(true);
      toast.success("Đặt lại mật khẩu thành công.");
    } catch {
      toast.error("Lỗi mạng, vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <Card className="glass-panel border-white/10">
        <CardHeader className="items-center space-y-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
            <CircleCheck className="size-7" aria-hidden="true" />
          </span>
          <CardTitle className="text-2xl">Đã đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="h-11 w-full" size="lg" onClick={() => router.push("/login")}>
            Đến trang đăng nhập
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-white/10">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
        <CardDescription>
          Xác minh bằng số điện thoại và email đã đăng ký để đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="fp-phone">Số điện thoại</Label>
            <Input
              id="fp-phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="0901234567"
              className="h-11 text-base"
              autoComplete="tel"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fp-email">Email đã đăng ký</Label>
            <Input
              id="fp-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="email@example.com"
              className="h-11 text-base"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fp-new">Mật khẩu mới</Label>
            <Input
              id="fp-new"
              type="password"
              value={form.newPassword}
              onChange={(e) => set("newPassword", e.target.value)}
              className="h-11 text-base"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fp-confirm">Xác nhận mật khẩu mới</Label>
            <Input
              id="fp-confirm"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              className="h-11 text-base"
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="h-11 w-full" size="lg" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Đặt lại mật khẩu
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Quay lại đăng nhập
        </Link>
      </CardFooter>
    </Card>
  );
}
