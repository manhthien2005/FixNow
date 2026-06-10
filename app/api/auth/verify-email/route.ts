import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import {
  EMAIL_OTP_MAX_ATTEMPTS,
  hashEmailOtp,
} from "@/lib/email-verification";
import { verifyEmailSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, otp } = parsed.data;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
        emailVerifiedAt: true,
        emailVerificationCodeHash: true,
        emailVerificationExpiresAt: true,
        emailVerificationAttempts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (user.emailVerifiedAt) {
      return NextResponse.json({ verified: true }, { status: 200 });
    }
    if (
      !user.emailVerificationCodeHash ||
      !user.emailVerificationExpiresAt ||
      new Date(user.emailVerificationExpiresAt).getTime() < Date.now()
    ) {
      return NextResponse.json({ error: "otp_expired" }, { status: 410 });
    }
    if (user.emailVerificationAttempts >= EMAIL_OTP_MAX_ATTEMPTS) {
      return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
    }

    const expectedHash = hashEmailOtp(email, otp);
    if (expectedHash !== user.emailVerificationCodeHash) {
      await db
        .update(users)
        .set({
          emailVerificationAttempts: user.emailVerificationAttempts + 1,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
      return NextResponse.json({ error: "otp_invalid" }, { status: 400 });
    }

    await db
      .update(users)
      .set({
        emailVerifiedAt: new Date(),
        emailVerificationCodeHash: null,
        emailVerificationExpiresAt: null,
        emailVerificationAttempts: 0,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/auth/verify-email]", error);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
