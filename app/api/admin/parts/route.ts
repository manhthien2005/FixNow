import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/db";
import { parts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { partCreateSchema } from "@/lib/validations/catalog";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isPgUniqueViolation(err: unknown): boolean {
  return isRecord(err) && err.code === "23505";
}

// GET /api/admin/parts → all parts (admin manage view, includes inactive)
export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const rows = await db.query.parts.findMany({
      orderBy: [asc(parts.type), asc(parts.name)],
    });
    return NextResponse.json({ parts: rows }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/parts]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// POST /api/admin/parts → create a part
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const body: unknown = await req.json();
    const parsed = partCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const [row] = await db.insert(parts).values(parsed.data).returning();
    revalidateTag("parts");
    return NextResponse.json({ part: row }, { status: 201 });
  } catch (error) {
    if (isPgUniqueViolation(error)) {
      return NextResponse.json(
        { error: "duplicate", message: "Tên linh kiện đã tồn tại." },
        { status: 409 },
      );
    }
    console.error("[POST /api/admin/parts]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
