import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { servicePrices } from "@/db/schema";

export async function GET() {
  try {
    const rows = await db.query.servicePrices.findMany({
      where: eq(servicePrices.isActive, true),
      orderBy: [asc(servicePrices.sortOrder)],
      columns: {
        id: true,
        serviceName: true,
        priceFrom: true,
        note: true,
        imagePath: true,
        sortOrder: true,
      },
    });

    return NextResponse.json({ services: rows }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/services]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
