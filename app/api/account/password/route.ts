import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validations/auth";

// POST /api/account/password → change password after verifying the current one
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const body: unknown = await req.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true, passwordHash: true },
    });
    if (!user) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const ok = await bcrypt.compare(
      parsed.data.currentPassword,
      user.passwordHash,
    );
    if (!ok) {
      return NextResponse.json(
        { error: "wrong_password", message: "Mật khẩu hiện tại không đúng." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/account/password]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
