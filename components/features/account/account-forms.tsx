"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Loader2, UserPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  INPUT_LIMITS,
  limitText,
  normalizeSpaces,
} from "@/lib/input-normalizers";
import { useI18n } from "@/components/i18n/language-provider";

interface AccountFormsProps {
  fullName: string;
  email: string;
}

export function AccountForms({ fullName, email }: AccountFormsProps) {
  const router = useRouter();
  const { dictionary, locale } = useI18n();

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
        body: JSON.stringify({
          fullName: normalizeSpaces(name),
          email: mail.trim().toLowerCase(),
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        toast.error(
          data.message ??
            (locale === "vi" ? "Cập nhật thất bại." : "Update failed."),
        );
        return;
      }
      toast.success(
        locale === "vi" ? "Đã cập nhật thông tin." : "Profile updated.",
      );
      router.refresh();
    } catch {
      toast.error(dictionary.auth.networkError);
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 6) {
      toast.error(
        locale === "vi"
          ? "Mật khẩu mới ít nhất 6 ký tự."
          : "New password must be at least 6 characters.",
      );
      return;
    }
    if (next !== confirm) {
      toast.error(
        locale === "vi"
          ? "Mật khẩu xác nhận không khớp."
          : "Password confirmation does not match.",
      );
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
        toast.error(
          data.message ??
            (locale === "vi"
              ? "Đổi mật khẩu thất bại."
              : "Could not change password."),
        );
        return;
      }
      toast.success(
        locale === "vi" ? "Đã đổi mật khẩu." : "Password changed.",
      );
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      toast.error(dictionary.auth.networkError);
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
          <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
            <UserPen className="size-5" aria-hidden="true" />
          </span>
          <h2 className="text-headline-sm text-on-surface">
            {locale === "vi" ? "Thông tin cá nhân" : "Personal information"}
          </h2>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="acc-name">{dictionary.common.fullName}</Label>
          <Input
            id="acc-name"
            value={name}
            onChange={(e) => setName(limitText(e.target.value, INPUT_LIMITS.name))}
            onBlur={(e) => setName(normalizeSpaces(e.target.value))}
            className="h-11 text-base"
            autoComplete="name"
            maxLength={INPUT_LIMITS.name}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="acc-email">{dictionary.common.email}</Label>
          <Input
            id="acc-email"
            type="email"
            value={mail}
            onChange={(e) => setMail(limitText(e.target.value, INPUT_LIMITS.email))}
            onBlur={(e) => setMail(e.target.value.trim().toLowerCase())}
            placeholder="email@example.com"
            className="h-11 text-base"
            autoComplete="email"
            maxLength={INPUT_LIMITS.email}
          />
          <p className="text-xs text-on-surface-variant">
            {locale === "vi"
              ? "Email dùng để đăng nhập và khôi phục mật khẩu."
              : "Email is used for login and password recovery."}
          </p>
        </div>

        <Button type="submit" disabled={savingProfile} className="mt-auto h-11 w-full">
          {savingProfile ? <Loader2 className="size-4 animate-spin" /> : null}
          {savingProfile ? dictionary.common.saving : dictionary.common.save}
        </Button>
      </form>

      {/* Change password */}
      <form
        onSubmit={changePassword}
        className="glass-panel flex flex-col gap-5 rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <h2 className="text-headline-sm text-on-surface">
            {locale === "vi" ? "Đổi mật khẩu" : "Change password"}
          </h2>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pw-current">
            {locale === "vi" ? "Mật khẩu hiện tại" : "Current password"}
          </Label>
          <Input
            id="pw-current"
            type="password"
            value={current}
            onChange={(e) =>
              setCurrent(limitText(e.target.value, INPUT_LIMITS.password))
            }
            className="h-11 text-base"
            autoComplete="current-password"
            maxLength={INPUT_LIMITS.password}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-new">{dictionary.auth.newPassword}</Label>
          <Input
            id="pw-new"
            type="password"
            value={next}
            onChange={(e) =>
              setNext(limitText(e.target.value, INPUT_LIMITS.password))
            }
            className="h-11 text-base"
            autoComplete="new-password"
            maxLength={INPUT_LIMITS.password}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-confirm">
            {dictionary.auth.confirmNewPassword}
          </Label>
          <Input
            id="pw-confirm"
            type="password"
            value={confirm}
            onChange={(e) =>
              setConfirm(limitText(e.target.value, INPUT_LIMITS.password))
            }
            className="h-11 text-base"
            autoComplete="new-password"
            maxLength={INPUT_LIMITS.password}
          />
        </div>

        <Button type="submit" disabled={savingPw} className="mt-auto h-11 w-full">
          {savingPw ? <Loader2 className="size-4 animate-spin" /> : null}
          {savingPw
            ? dictionary.common.processing
            : locale === "vi"
              ? "Đổi mật khẩu"
              : "Change password"}
        </Button>
      </form>
    </div>
  );
}
