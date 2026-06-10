"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BadgeCheck, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/i18n/language-provider";

interface EmailVerificationPanelProps {
  email: string;
  verified: boolean;
}

export function EmailVerificationPanel({
  email,
  verified,
}: EmailVerificationPanelProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const isVi = locale === "vi";
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  async function sendCode() {
    setSending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setOtpSent(true);
        toast.success(
          isVi
            ? "Đã gửi mã xác thực tới email của bạn."
            : "Verification code sent to your email.",
        );
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      const message =
        data.error === "cooldown"
          ? isVi
            ? "Vui lòng chờ một phút trước khi gửi lại."
            : "Please wait a minute before resending."
          : data.error === "smtp_unconfigured"
            ? isVi
              ? "Tính năng gửi email chưa được cấu hình."
              : "Email sending is not configured."
            : isVi
              ? "Không thể gửi mã. Vui lòng thử lại."
              : "Could not send the code. Please try again.";
      toast.error(message);
    } catch {
      toast.error(
        isVi ? "Lỗi mạng, vui lòng thử lại." : "Network error. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (res.ok) {
        toast.success(isVi ? "Đã xác thực email." : "Email verified.");
        setOtp("");
        setOtpSent(false);
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      const message =
        data.error === "otp_expired"
          ? isVi
            ? "Mã đã hết hạn. Vui lòng gửi lại."
            : "Code expired. Please resend."
          : data.error === "too_many_attempts"
            ? isVi
              ? "Sai quá nhiều lần. Vui lòng gửi lại mã."
              : "Too many attempts. Please resend the code."
            : isVi
              ? "Mã không hợp lệ."
              : "Invalid code.";
      toast.error(message);
    } catch {
      toast.error(
        isVi ? "Lỗi mạng, vui lòng thử lại." : "Network error. Please try again.",
      );
    } finally {
      setVerifying(false);
    }
  }

  return (
    <section className="glass-panel rounded-2xl p-6 md:p-8">
      <div className="flex flex-wrap items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
          <MailCheck className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-headline-sm text-on-surface">
            {isVi ? "Xác thực email" : "Email verification"}
          </h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {verified
              ? isVi
                ? "Địa chỉ email của bạn đã được xác thực."
                : "Your email address is verified."
              : isVi
                ? "Xác thực email giúp bảo vệ tài khoản và nhận thông báo lịch hẹn."
                : "Verify your email to secure your account and receive booking updates."}
          </p>
          <p className="mt-1 truncate text-body-md text-on-surface-variant/80">
            {email}
          </p>
        </div>
        {verified ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-label-md font-medium text-emerald-500">
            <BadgeCheck className="size-4" aria-hidden="true" />
            {isVi ? "Đã xác thực" : "Verified"}
          </span>
        ) : null}
      </div>

      {verified ? null : (
        <div className="mt-6">
          {otpSent ? (
            <form
              onSubmit={verify}
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="account-otp">
                  {isVi ? "Mã OTP (6 số)" : "OTP code (6 digits)"}
                </Label>
                <Input
                  id="account-otp"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="h-11 text-base tracking-[0.35em]"
                />
              </div>
              <Button
                type="submit"
                disabled={verifying || otp.length !== 6}
                className="h-11"
              >
                {verifying ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {isVi ? "Xác thực" : "Verify"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11"
                onClick={sendCode}
                disabled={sending}
              >
                {isVi ? "Gửi lại mã" : "Resend"}
              </Button>
            </form>
          ) : (
            <Button
              type="button"
              onClick={sendCode}
              disabled={sending}
              className="h-11"
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {isVi ? "Gửi mã xác thực" : "Send verification code"}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
