import { NextRequest, NextResponse } from "next/server";
import { like } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { bookingSchema } from "@/lib/validations/booking";

const MAX_CODE_RETRY = 5;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPgUniqueViolation(err: unknown): boolean {
  return isRecord(err) && err.code === "23505";
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    // bookingSchema marks preferredTime as ISO-datetime OR literal "" OR undefined.
    // Normalize "" → undefined so downstream code only deals with two cases.
    let normalized: unknown = body;
    if (isRecord(body) && body.preferredTime === "") {
      normalized = { ...body, preferredTime: undefined };
    }

    const parsed = bookingSchema.safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;

    const preferredTimeDate = parsed.data.preferredTime
      ? new Date(parsed.data.preferredTime)
      : null;

    const year = new Date().getFullYear();

    for (let attempt = 1; attempt <= MAX_CODE_RETRY; attempt++) {
      const count = await db.$count(
        appointments,
        like(appointments.appointmentCode, `FN-${year}-%`),
      );
      const code = `FN-${year}-${String(count + 1).padStart(4, "0")}`;

      try {
        const [row] = await db
          .insert(appointments)
          .values({
            appointmentCode: code,
            userId,
            customerName: parsed.data.customerName,
            phone: parsed.data.phone,
            address: parsed.data.address,
            deviceType: parsed.data.deviceType,
            serviceGroup: parsed.data.serviceGroup,
            issueDescription: parsed.data.issueDescription,
            preferredTime: preferredTimeDate,
            status: "RECEIVED",
          })
          .returning({
            id: appointments.id,
            appointmentCode: appointments.appointmentCode,
          });

        return NextResponse.json({ appointment: row }, { status: 201 });
      } catch (err) {
        if (isPgUniqueViolation(err) && attempt < MAX_CODE_RETRY) continue;
        throw err;
      }
    }

    throw new Error("appointment_code_generation_failed");
  } catch (error) {
    console.error("[POST /api/appointments]", error);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
