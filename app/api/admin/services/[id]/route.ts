import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/db";
import { servicePrices } from "@/db/schema";
import { auth } from "@/lib/auth";
import { servicePriceUpdateSchema } from "@/lib/validations/catalog";
import { removeStoredImage } from "@/lib/storage-cleanup";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isPgUniqueViolation(err: unknown): boolean {
  return isRecord(err) && err.code === "23505";
}

// PATCH /api/admin/services/:id → update a service price
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const { id } = await params;

    const body: unknown = await req.json();
    const parsed = servicePriceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existing = await db.query.servicePrices.findFirst({
      where: eq(servicePrices.id, id),
      columns: { id: true, imagePath: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const [row] = await db
      .update(servicePrices)
      .set(parsed.data)
      .where(eq(servicePrices.id, id))
      .returning();

    if (
      parsed.data.imagePath !== undefined &&
      existing.imagePath &&
      existing.imagePath !== parsed.data.imagePath
    ) {
      await removeStoredImage(existing.imagePath);
    }

    revalidateTag("service-prices");
    return NextResponse.json({ service: row }, { status: 200 });
  } catch (error) {
    if (isPgUniqueViolation(error)) {
      return NextResponse.json(
        { error: "duplicate", message: "Tên dịch vụ đã tồn tại." },
        { status: 409 },
      );
    }
    console.error("[PATCH /api/admin/services/:id]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// DELETE /api/admin/services/:id → delete a service price (+ its image)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const { id } = await params;

    const existing = await db.query.servicePrices.findFirst({
      where: eq(servicePrices.id, id),
      columns: { id: true, imagePath: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    await db.delete(servicePrices).where(eq(servicePrices.id, id));
    await removeStoredImage(existing.imagePath);

    revalidateTag("service-prices");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/services/:id]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
