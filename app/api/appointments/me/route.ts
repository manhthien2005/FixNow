import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { appointments } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const rows = await db.query.appointments.findMany({
      where: eq(appointments.userId, userId),
      orderBy: [desc(appointments.createdAt)],
      columns: {
        appointmentCode: true,
        customerName: true,
        phone: true,
        address: true,
        deviceType: true,
        serviceGroup: true,
        issueDescription: true,
        preferredTime: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ appointments: rows }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/appointments/me]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
