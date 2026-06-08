import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/db";
import { parts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { partUpdateSchema } from "@/lib/validations/catalog";
import { removeStoredImage } from "@/lib/storage-cleanup";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isPgUniqueViolation(err: unknown): boolean {
  return isRecord(err) && err.code === "23505";
}

// PATCH /api/admin/parts/:id → update a part
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
    const parsed = partUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existing = await db.query.parts.findFirst({
      where: eq(parts.id, id),
      columns: { id: true, imagePath: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const [row] = await db
      .update(parts)
      .set(parsed.data)
      .where(eq(parts.id, id))
      .returning();

    // If the image was replaced, delete the old object (best-effort).
    if (
      parsed.data.imagePath !== undefined &&
      existing.imagePath &&
      existing.imagePath !== parsed.data.imagePath
    ) {
      await removeStoredImage(existing.imagePath);
    }

    revalidateTag("parts");
    return NextResponse.json({ part: row }, { status: 200 });
  } catch (error) {
    if (isPgUniqueViolation(error)) {
      return NextResponse.json(
        { error: "duplicate", message: "Tên linh kiện đã tồn tại." },
        { status: 409 },
      );
    }
    console.error("[PATCH /api/admin/parts/:id]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// DELETE /api/admin/parts/:id → delete a part (+ its image)
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

    const existing = await db.query.parts.findFirst({
      where: eq(parts.id, id),
      columns: { id: true, imagePath: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    await db.delete(parts).where(eq(parts.id, id));
    await removeStoredImage(existing.imagePath);

    revalidateTag("parts");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/admin/parts/:id]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
