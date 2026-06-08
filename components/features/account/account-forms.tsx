"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Loader2, UserPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountFormsProps {
  fullName: string;
  email: string;
}

export function AccountForms({ fullName, email }: AccountFormsProps) {
  const router = useRouter();

  // Profile
  const [name, setName] = useState(fullName);
  const [mail, setMail] = useState(email);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name.trim(), email: mail.trim() }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        toast.error(data.message ?? "Cập nhật thất bại.");
        return;
      }
      toast.success("Đã cập nhật thông tin.");
      router.refresh();
    } catch {
      toast.error("Lỗi mạng, vui lòng thử lại.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 6) {
      toast.error("Mật khẩu mới ít nhất 6 ký tự.");
      return;
    }
    if (next !== confirm) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: current,
          newPassword: next,
          confirmPassword: confirm,
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        toast.error(data.message ?? "Đổi mật khẩu thất bại.");
        return;
      }
      toast.success("Đã đổi mật khẩu.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      toast.error("Lỗi mạng, vui lòng thử lại.");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Edit profile */}
      <form
        onSubmit={saveProfile}
        className="glass-panel flex flex-col gap-5 rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-surface-container-high/50 text-secondary">
            <UserPen className="size-5" aria-hidden="true" />
          </span>
          <h2 className="text-headline-sm text-on-surface">Thông tin cá nhân</h2>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="acc-name">Họ và tên</Label>
          <Input
            id="acc-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 text-base"
            autoComplete="name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="acc-email">Email</Label>
          <Input
            id="acc-email"
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            placeholder="email@example.com"
            className="h-11 text-base"
            autoComplete="email"
          />
          <p className="text-xs text-on-surface-variant">
            Email dùng để đăng nhập và khôi phục mật khẩu.
          </p>
        </div>

        <Button type="submit" disabled={savingProfile} className="mt-auto h-11 w-full">
          {savingProfile ? <Loader2 className="size-4 animate-spin" /> : null}
          Lưu thay đổi
        </Button>
      </form>

      {/* Change password */}
      <form
        onSubmit={changePassword}
        className="glass-panel flex flex-col gap-5 rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-surface-container-high/50 text-secondary">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <h2 className="text-headline-sm text-on-surface">Đổi mật khẩu</h2>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pw-current">Mật khẩu hiện tại</Label>
          <Input
            id="pw-current"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="h-11 text-base"
            autoComplete="current-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-new">Mật khẩu mới</Label>
          <Input
            id="pw-new"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="h-11 text-base"
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-confirm">Xác nhận mật khẩu mới</Label>
          <Input
            id="pw-confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11 text-base"
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" disabled={savingPw} className="mt-auto h-11 w-full">
          {savingPw ? <Loader2 className="size-4 animate-spin" /> : null}
          Đổi mật khẩu
        </Button>
      </form>
    </div>
  );
}
