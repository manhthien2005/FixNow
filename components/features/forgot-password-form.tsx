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
import { forgotPasswordSchema } from "@/lib/validations/auth";
import {
  INPUT_LIMITS,
  PHONE_RAW_INPUT_MAX_LENGTH,
  limitText,
  sanitizePhoneInput,
} from "@/lib/input-normalizers";
import { useI18n } from "@/components/i18n/language-provider";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { dictionary } = useI18n();
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
    const parsed = forgotPasswordSchema.safeParse(form);
    if (!parsed.success) {
      const firstMessage = parsed.error.issues[0]?.message;
      toast.error(firstMessage ?? dictionary.auth.invalidForm);
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        toast.error(data.message ?? dictionary.auth.resetFailed);
        return;
      }
      setDone(true);
      toast.success(dictionary.auth.resetSuccess);
    } catch {
      toast.error(dictionary.auth.networkError);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <Card className="glass-panel border-border">
        <CardHeader className="items-center space-y-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
            <CircleCheck className="size-7" aria-hidden="true" />
          </span>
          <CardTitle className="text-2xl">
            {dictionary.auth.resetDoneTitle}
          </CardTitle>
          <CardDescription>
            {dictionary.auth.resetDoneText}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="h-11 w-full" size="lg" onClick={() => router.push("/login")}>
            {dictionary.auth.goLogin}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-border">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">{dictionary.auth.forgotTitle}</CardTitle>
        <CardDescription>
          {dictionary.auth.forgotDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="fp-phone">{dictionary.common.phone}</Label>
            <Input
              id="fp-phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => set("phone", sanitizePhoneInput(e.target.value))}
              placeholder="0901234567"
              className="h-11 text-base"
              autoComplete="tel"
              maxLength={PHONE_RAW_INPUT_MAX_LENGTH}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fp-email">{dictionary.auth.registeredEmail}</Label>
            <Input
              id="fp-email"
              type="email"
              value={form.email}
              onChange={(e) =>
                set("email", limitText(e.target.value, INPUT_LIMITS.email))
              }
              onBlur={(e) => set("email", e.target.value.trim().toLowerCase())}
              placeholder="email@example.com"
              className="h-11 text-base"
              autoComplete="email"
              maxLength={INPUT_LIMITS.email}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fp-new">{dictionary.auth.newPassword}</Label>
            <Input
              id="fp-new"
              type="password"
              value={form.newPassword}
              onChange={(e) =>
                set(
                  "newPassword",
                  limitText(e.target.value, INPUT_LIMITS.password),
                )
              }
              className="h-11 text-base"
              autoComplete="new-password"
              maxLength={INPUT_LIMITS.password}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fp-confirm">
              {dictionary.auth.confirmNewPassword}
            </Label>
            <Input
              id="fp-confirm"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                set(
                  "confirmPassword",
                  limitText(e.target.value, INPUT_LIMITS.password),
                )
              }
              className="h-11 text-base"
              autoComplete="new-password"
              maxLength={INPUT_LIMITS.password}
            />
          </div>
          <Button type="submit" className="h-11 w-full" size="lg" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            {dictionary.auth.resetPassword}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          {dictionary.auth.backLogin}
        </Link>
      </CardFooter>
    </Card>
  );
}
