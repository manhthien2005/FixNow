"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { phoneRegex } from "@/lib/validations/auth";
import {
  INPUT_LIMITS,
  PHONE_RAW_INPUT_MAX_LENGTH,
  sanitizeAppointmentCodeInput,
  sanitizePhoneInput,
} from "@/lib/input-normalizers";
import { useI18n } from "@/components/i18n/language-provider";

const APPOINTMENT_CODE_REGEX = /^FN-\d{4}-\d{4}$/;

interface TrackFormProps {
  defaultPhone?: string;
  defaultCode?: string;
}

export function TrackForm({ defaultPhone, defaultCode }: TrackFormProps) {
  const router = useRouter();
  const { dictionary } = useI18n();
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [code, setCode] = useState(defaultCode ?? "");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPhone = sanitizePhoneInput(phone);
    const trimmedCode = sanitizeAppointmentCodeInput(code);

    let valid = true;
    if (!phoneRegex.test(trimmedPhone)) {
      setPhoneError(dictionary.track.phoneInvalid);
      valid = false;
    } else {
      setPhoneError(null);
    }

    if (!APPOINTMENT_CODE_REGEX.test(trimmedCode)) {
      setCodeError(dictionary.track.codeInvalid);
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
              <Label htmlFor="track-phone">{dictionary.track.phone}</Label>
              <Input
                id="track-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0901234567"
                className="h-11 text-base"
                value={phone}
                onChange={(event) => setPhone(sanitizePhoneInput(event.target.value))}
                aria-invalid={phoneError ? "true" : undefined}
                maxLength={PHONE_RAW_INPUT_MAX_LENGTH}
              />
              {phoneError ? (
                <p className="text-sm text-destructive">{phoneError}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="track-code">{dictionary.track.code}</Label>
              <Input
                id="track-code"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder={dictionary.track.codePlaceholder}
                className="h-11 font-mono text-base uppercase"
                value={code}
                onChange={(event) =>
                  setCode(sanitizeAppointmentCodeInput(event.target.value))
                }
                aria-invalid={codeError ? "true" : undefined}
                maxLength={INPUT_LIMITS.appointmentCode}
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
            className="h-11 w-full md:w-auto"
          >
            <Search className="mr-2 size-4" />
            {isPending ? dictionary.track.searching : dictionary.track.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
