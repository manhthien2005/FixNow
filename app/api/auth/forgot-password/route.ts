import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "@/db";
import { users } from "@/db/schema";
import { forgotPasswordSchema } from "@/lib/validations/auth";

/**
 * POST /api/auth/forgot-password
 * No email infrastructure in this project, so identity is verified by matching
 * BOTH the registered phone AND email on the same account, then the user sets a
 * new password directly. (Security note: weaker than an email-token flow; fine
 * for an academic project. Users who registered without an email cannot self-
 * reset and must contact support.)
 */
export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { phone, email, newPassword } = parsed.data;

    const user = await db.query.users.findFirst({
      where: and(eq(users.phone, phone), eq(users.email, email)),
      columns: { id: true },
    });

    // Generic message either way (don't leak which field was wrong).
    if (!user) {
      return NextResponse.json(
        {
          error: "no_match",
          message:
            "Không tìm thấy tài khoản khớp với số điện thoại và email đã nhập.",
        },
        { status: 404 },
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/auth/forgot-password]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
