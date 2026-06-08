import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { isTransitionAllowed } from "@/lib/appointment-status";
import { appointmentStatusUpdateSchema } from "@/lib/validations/admin";
import { appointmentCodeParamsSchema } from "@/lib/validations/booking";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const parsedParams = appointmentCodeParamsSchema.safeParse(await params);
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: "validation", details: parsedParams.error.flatten() },
        { status: 400 },
      );
    }

    const body: unknown = await req.json();
    const parsed = appointmentStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const appt = await db.query.appointments.findFirst({
      where: eq(appointments.appointmentCode, parsedParams.data.code),
      columns: { id: true, status: true },
    });

    if (!appt) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (!isTransitionAllowed(appt.status, parsed.data.status)) {
      return NextResponse.json(
        {
          error: "invalid_transition",
          from: appt.status,
          to: parsed.data.status,
        },
        { status: 409 },
      );
    }

    await db
      .update(appointments)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(appointments.id, appt.id));

    return NextResponse.json(
      { success: true, status: parsed.data.status },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PATCH /api/appointments/:code/status]", error);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
