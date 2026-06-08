import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db } from "@/db";
import { servicePrices } from "@/db/schema";
import { auth } from "@/lib/auth";
import { servicePriceCreateSchema } from "@/lib/validations/catalog";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isPgUniqueViolation(err: unknown): boolean {
  return isRecord(err) && err.code === "23505";
}

// GET /api/admin/services → all service prices (incl. inactive)
export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const rows = await db.query.servicePrices.findMany({
      orderBy: [asc(servicePrices.sortOrder)],
    });
    return NextResponse.json({ services: rows }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/services]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// POST /api/admin/services → create a service price
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const body: unknown = await req.json();
    const parsed = servicePriceCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const [row] = await db
      .insert(servicePrices)
      .values(parsed.data)
      .returning();
    revalidateTag("service-prices");
    return NextResponse.json({ service: row }, { status: 201 });
  } catch (error) {
    if (isPgUniqueViolation(error)) {
      return NextResponse.json(
        { error: "duplicate", message: "Tên dịch vụ đã tồn tại." },
        { status: 409 },
      );
    }
    console.error("[POST /api/admin/services]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
