import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { setVerificationDiscountPercent } from "@/lib/settings";
import { adminSettingsSchema } from "@/lib/validations/admin";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const body: unknown = await req.json();
    const parsed = adminSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const value = await setVerificationDiscountPercent(
      parsed.data.verificationDiscountPercent,
    );

    return NextResponse.json(
      { verificationDiscountPercent: value },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PATCH /api/admin/settings]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
