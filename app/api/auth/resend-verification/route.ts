import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import {
  canResendEmailOtp,
  emailOtpExpiresAt,
  generateEmailOtp,
  hashEmailOtp,
} from "@/lib/email-verification";
import {
  isSmtpConfigured,
  MailConfigError,
  sendEmailVerificationOtp,
} from "@/lib/mail";
import { resendVerificationSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    if (!isSmtpConfigured) {
      return NextResponse.json({ error: "smtp_unconfigured" }, { status: 503 });
    }

    const body: unknown = await req.json();
    const parsed = resendVerificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email } = parsed.data;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
        emailVerifiedAt: true,
        emailVerificationSentAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (user.emailVerifiedAt) {
      return NextResponse.json({ verified: true }, { status: 200 });
    }
    if (!canResendEmailOtp(user.emailVerificationSentAt)) {
      return NextResponse.json({ error: "cooldown" }, { status: 429 });
    }

    const otp = generateEmailOtp();
    const now = new Date();
    await db
      .update(users)
      .set({
        emailVerificationCodeHash: hashEmailOtp(email, otp),
        emailVerificationExpiresAt: emailOtpExpiresAt(now),
        emailVerificationAttempts: 0,
        emailVerificationSentAt: now,
        updatedAt: now,
      })
      .where(eq(users.id, user.id));

    await sendEmailVerificationOtp({ email, otp });

    return NextResponse.json({ sent: true }, { status: 200 });
  } catch (error) {
    if (error instanceof MailConfigError) {
      return NextResponse.json({ error: "smtp_unconfigured" }, { status: 503 });
    }
    console.error("[POST /api/auth/resend-verification]", error);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
