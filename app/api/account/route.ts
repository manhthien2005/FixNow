import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations/auth";

// PATCH /api/account → update the signed-in user's profile (name, email)
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const body: unknown = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const email = parsed.data.email;

    // Read the current email so we can invalidate verification if it changes.
    const current = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { email: true },
    });

    // Enforce email uniqueness (excluding the current user).
    const clash = await db.query.users.findFirst({
      where: and(eq(users.email, email), ne(users.id, userId)),
      columns: { id: true },
    });
    if (clash) {
      return NextResponse.json(
        { error: "email_taken", message: "Email đã được sử dụng." },
        { status: 409 },
      );
    }

    const emailChanged = current?.email !== email;

    const [row] = await db
      .update(users)
      .set({
        fullName: parsed.data.fullName,
        email,
        // Changing email invalidates any prior email verification.
        ...(emailChanged
          ? {
              emailVerifiedAt: null,
              emailVerificationCodeHash: null,
              emailVerificationExpiresAt: null,
              emailVerificationAttempts: 0,
              emailVerificationSentAt: null,
            }
          : {}),
      })
      .where(eq(users.id, userId))
      .returning({
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
      });

    return NextResponse.json({ user: row }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/account]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
