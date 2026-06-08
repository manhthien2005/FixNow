"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { phoneRegex } from "@/lib/validations/auth";

const APPOINTMENT_CODE_REGEX = /^FN-\d{4}-\d{4}$/;

interface TrackFormProps {
  defaultPhone?: string;
  defaultCode?: string;
}

export function TrackForm({ defaultPhone, defaultCode }: TrackFormProps) {
  const router = useRouter();
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [code, setCode] = useState(defaultCode ?? "");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPhone = phone.trim();
    const trimmedCode = code.trim().toUpperCase();

    let valid = true;
    if (!phoneRegex.test(trimmedPhone)) {
      setPhoneError("Số điện thoại không hợp lệ");
      valid = false;
    } else {
      setPhoneError(null);
    }

    if (!APPOINTMENT_CODE_REGEX.test(trimmedCode)) {
      setCodeError("Mã lịch hẹn phải có dạng FN-YYYY-XXXX");
      valid = false;
    } else {
      setCodeError(null);
    }

    if (!valid) return;

    setIsPending(true);
    const params = new URLSearchParams({
      phone: trimmedPhone,
      code: trimmedCode,
    });
    router.push(`/track?${params.toString()}`);
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="track-phone">Số điện thoại</Label>
              <Input
                id="track-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0901234567"
                className="text-base"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                aria-invalid={phoneError ? "true" : undefined}
              />
              {phoneError ? (
                <p className="text-sm text-destructive">{phoneError}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="track-code">Mã lịch hẹn</Label>
              <Input
                id="track-code"
                type="text"
                autoComplete="off"
                placeholder="FN-2026-0001"
                className="font-mono text-base uppercase"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                aria-invalid={codeError ? "true" : undefined}
              />
              {codeError ? (
                <p className="text-sm text-destructive">{codeError}</p>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full md:w-auto"
          >
            <Search className="mr-2 size-4" />
            {isPending ? "Đang tra cứu..." : "Tra cứu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
