import { NextRequest, NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { auth } from "@/lib/auth";
import { addressCreateSchema } from "@/lib/validations/address";

const MAX_ADDRESSES = 10;

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const rows = await db.query.userAddresses.findMany({
      where: eq(userAddresses.userId, userId),
      orderBy: [desc(userAddresses.isDefault), asc(userAddresses.createdAt)],
      columns: {
        id: true,
        label: true,
        address: true,
        isDefault: true,
      },
    });

    return NextResponse.json({ addresses: rows }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/account/addresses]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const body: unknown = await req.json();
    const parsed = addressCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const count = await db.$count(
      userAddresses,
      eq(userAddresses.userId, userId),
    );
    if (count >= MAX_ADDRESSES) {
      return NextResponse.json(
        { error: "limit_reached", message: "Tối đa 10 địa chỉ." },
        { status: 409 },
      );
    }

    // First address is always the default; or honor an explicit request.
    const makeDefault = parsed.data.isDefault || count === 0;

    const row = await db.transaction(async (tx) => {
      if (makeDefault) {
        await tx
          .update(userAddresses)
          .set({ isDefault: false })
          .where(eq(userAddresses.userId, userId));
      }
      const [inserted] = await tx
        .insert(userAddresses)
        .values({
          userId,
          label: parsed.data.label?.trim() ? parsed.data.label.trim() : null,
          address: parsed.data.address,
          isDefault: makeDefault,
        })
        .returning({
          id: userAddresses.id,
          label: userAddresses.label,
          address: userAddresses.address,
          isDefault: userAddresses.isDefault,
        });
      return inserted;
    });

    return NextResponse.json({ address: row }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/account/addresses]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
