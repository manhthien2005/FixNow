import "server-only";
import { createHmac, randomInt } from "crypto";

export const EMAIL_OTP_TTL_MS = 10 * 60 * 1000;
export const EMAIL_OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const EMAIL_OTP_MAX_ATTEMPTS = 5;

function otpSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "fixnow-local-email-verification-secret"
  );
}

export function generateEmailOtp(): string {
  return randomInt(100000, 1000000).toString();
}

export function hashEmailOtp(email: string, otp: string): string {
  return createHmac("sha256", otpSecret())
    .update(`${email.trim().toLowerCase()}:${otp}`)
    .digest("hex");
}

export function emailOtpExpiresAt(now = new Date()): Date {
  return new Date(now.getTime() + EMAIL_OTP_TTL_MS);
}

export function canResendEmailOtp(
  lastSentAt: Date | string | null | undefined,
  now = new Date(),
): boolean {
  if (!lastSentAt) return true;
  return now.getTime() - new Date(lastSentAt).getTime() >= EMAIL_OTP_RESEND_COOLDOWN_MS;
}
