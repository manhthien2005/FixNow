import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq, ilike } from "drizzle-orm";

import { db } from "@/db";
import { parts } from "@/db/schema";
import { publicPartsQuerySchema } from "@/lib/validations/catalog";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = publicPartsQuerySchema.safeParse(
      Object.fromEntries(url.searchParams),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { type, q, limit, offset } = parsed.data;
    const typeFilter = type ? eq(parts.type, type) : undefined;
    const searchFilter = q
      ? ilike(parts.name, `%${q.replace(/[%_\\]/g, "\\$&")}%`)
      : undefined;
    const where = and(eq(parts.isActive, true), typeFilter, searchFilter);

    const [total, rows] = await Promise.all([
      db.$count(parts, where),
      db.query.parts.findMany({
        where,
        orderBy: [asc(parts.type), asc(parts.name)],
        limit,
        offset,
        columns: {
          id: true,
          type: true,
          name: true,
          price: true,
          warranty: true,
          note: true,
          imagePath: true,
        },
      }),
    ]);

    return NextResponse.json(
      { parts: rows, total, limit, offset },
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/parts]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
