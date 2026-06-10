import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { appointments } from "@/db/schema";
import { appointmentTrackQuerySchema } from "@/lib/validations/booking";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = appointmentTrackQuerySchema.safeParse(
      Object.fromEntries(url.searchParams),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const appt = await db.query.appointments.findFirst({
      where: and(
        eq(appointments.phone, parsed.data.phone),
        eq(appointments.appointmentCode, parsed.data.code),
      ),
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
        discountPercent: true,
        discountReason: true,
        verificationDiscountApplied: true,
      },
    });

    if (!appt) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ appointment: appt }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/appointments/track]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
