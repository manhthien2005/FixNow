import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { auth } from "@/lib/auth";
import { addressUpdateSchema } from "@/lib/validations/address";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const { id } = await params;
    const body: unknown = await req.json();
    const parsed = addressUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existing = await db.query.userAddresses.findFirst({
      where: and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)),
      columns: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const now = new Date();
    const row = await db.transaction(async (tx) => {
      if (parsed.data.isDefault === true) {
        await tx
          .update(userAddresses)
          .set({ isDefault: false })
          .where(eq(userAddresses.userId, userId));
      }
      const [updated] = await tx
        .update(userAddresses)
        .set({
          ...(parsed.data.address !== undefined
            ? { address: parsed.data.address }
            : {}),
          ...(parsed.data.label !== undefined
            ? { label: parsed.data.label?.trim() ? parsed.data.label.trim() : null }
            : {}),
          ...(parsed.data.isDefault !== undefined
            ? { isDefault: parsed.data.isDefault }
            : {}),
          updatedAt: now,
        })
        .where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)))
        .returning({
          id: userAddresses.id,
          label: userAddresses.label,
          address: userAddresses.address,
          isDefault: userAddresses.isDefault,
        });
      return updated;
    });

    return NextResponse.json({ address: row }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/account/addresses/:id]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const { id } = await params;

    const row = await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(userAddresses)
        .where(and(eq(userAddresses.id, id), eq(userAddresses.userId, userId)))
        .returning({
          id: userAddresses.id,
          wasDefault: userAddresses.isDefault,
        });
      if (!deleted) return null;

      // If we removed the default, promote the next address (if any).
      if (deleted.wasDefault) {
        const next = await tx.query.userAddresses.findFirst({
          where: eq(userAddresses.userId, userId),
          columns: { id: true },
        });
        if (next) {
          await tx
            .update(userAddresses)
            .set({ isDefault: true })
            .where(eq(userAddresses.id, next.id));
        }
      }
      return deleted;
    });

    if (!row) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/account/addresses/:id]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
