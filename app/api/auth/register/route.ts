import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { registerSchema } from "@/lib/validations/auth";

// TODO: rate limit
export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { fullName, phone, password } = parsed.data;
    const email =
      parsed.data.email === undefined || parsed.data.email === ""
        ? null
        : parsed.data.email;

    const existingPhone = await db.query.users.findFirst({
      where: eq(users.phone, phone),
      columns: { id: true },
    });
    if (existingPhone) {
      return NextResponse.json({ error: "phone_taken" }, { status: 409 });
    }

    if (email !== null) {
      const existingEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
        columns: { id: true },
      });
      if (existingEmail) {
        return NextResponse.json({ error: "email_taken" }, { status: 409 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [inserted] = await db
      .insert(users)
      .values({
        fullName,
        phone,
        email,
        passwordHash,
        role: "CUSTOMER",
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        phone: users.phone,
        email: users.email,
        role: users.role,
      });

    return NextResponse.json({ user: inserted }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
