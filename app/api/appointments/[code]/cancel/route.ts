import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    const appt = await db.query.appointments.findFirst({
      where: eq(appointments.appointmentCode, code),
      columns: { id: true, userId: true, status: true },
    });

    if (!appt) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (appt.userId !== session.user.id) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    if (appt.status !== "RECEIVED") {
      return NextResponse.json(
        { error: "not_cancellable", status: appt.status },
        { status: 409 },
      );
    }

    await db
      .update(appointments)
      .set({ status: "CANCELLED", updatedAt: new Date() })
      .where(eq(appointments.id, appt.id));

    return NextResponse.json(
      { success: true, status: "CANCELLED" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/appointments/:code/cancel]", error);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
