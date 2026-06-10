import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { appointments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { appointmentCodeParamsSchema } from "@/lib/validations/booking";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const parsed = appointmentCodeParamsSchema.safeParse(await params);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const appt = await db.query.appointments.findFirst({
      where: eq(appointments.appointmentCode, parsed.data.code),
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
        userId: true,
        discountPercent: true,
        discountReason: true,
        verificationDiscountApplied: true,
      },
    });

    if (!appt) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = appt.userId === session.user.id;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const { userId: _userId, ...appointment } = appt;
    return NextResponse.json({ appointment }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/appointments/:code]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
