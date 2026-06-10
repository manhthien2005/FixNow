import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, ilike, isNull, like, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { appointments, userVerifications, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { adminListFilterSchema } from "@/lib/validations/admin";
import { bookingApiSchema } from "@/lib/validations/booking";
import { getVerificationDiscountPercent } from "@/lib/settings";

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

    // bookingApiSchema marks preferredTime as ISO-datetime OR literal "" OR undefined.
    // Normalize "" → undefined so downstream code only deals with two cases.
    let normalized: unknown = body;
    if (isRecord(body) && body.preferredTime === "") {
      normalized = { ...body, preferredTime: undefined };
    }

    const parsed = bookingApiSchema.safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;

    const wantsDiscount =
      Boolean(parsed.data.useVerificationDiscount) && userId !== null;
    const discountPercent = await getVerificationDiscountPercent();

    const preferredTimeDate = parsed.data.preferredTime
      ? new Date(parsed.data.preferredTime)
      : null;

    const year = new Date().getFullYear();

    for (let attempt = 1; attempt <= MAX_CODE_RETRY; attempt++) {
      try {
        const result = await db.transaction(async (tx) => {
          const count = await tx.$count(
            appointments,
            like(appointments.appointmentCode, `FN-${year}-%`),
          );
          const code = `FN-${year}-${String(count + 1).padStart(4, "0")}`;
          const now = new Date();

          // Best-effort discount: never fail the booking because of it.
          let discountApplied = false;
          if (wantsDiscount && userId && discountPercent > 0) {
            const approved = await tx.query.userVerifications.findFirst({
              where: and(
                eq(userVerifications.userId, userId),
                eq(userVerifications.status, "APPROVED"),
              ),
              columns: { id: true },
            });
            if (approved) {
              const [updated] = await tx
                .update(users)
                .set({ verificationDiscountUsedAt: now, updatedAt: now })
                .where(
                  and(
                    eq(users.id, userId),
                    isNull(users.verificationDiscountUsedAt),
                  ),
                )
                .returning({ id: users.id });
              discountApplied = Boolean(updated);
            }
          }

          const [inserted] = await tx
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
              discountPercent: discountApplied ? discountPercent : 0,
              discountReason: discountApplied
                ? "Ưu đãi xác thực học sinh/sinh viên/nhân viên"
                : null,
              verificationDiscountApplied: discountApplied,
            })
            .returning({
              id: appointments.id,
              appointmentCode: appointments.appointmentCode,
            });

          return { appointment: inserted, discountApplied };
        });

        return NextResponse.json(
          {
            appointment: result.appointment,
            discountApplied: result.discountApplied,
            discountRequested: wantsDiscount,
          },
          { status: 201 },
        );
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

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const parsed = adminListFilterSchema.safeParse(
      Object.fromEntries(url.searchParams),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { status, q, limit, offset } = parsed.data;

    let statusFilter: SQL | undefined;
    let searchFilter: SQL | undefined;

    if (status) {
      statusFilter = eq(appointments.status, status);
    }
    if (q) {
      const escaped = q.replace(/[%_\\]/g, "\\$&");
      const pattern = `%${escaped}%`;
      searchFilter = or(
        ilike(appointments.appointmentCode, pattern),
        ilike(appointments.phone, pattern),
      );
    }

    const where = and(statusFilter, searchFilter);

    const [total, rows] = await Promise.all([
      db.$count(appointments, where),
      db.query.appointments.findMany({
        where,
        orderBy: [desc(appointments.createdAt)],
        limit,
        offset,
        columns: {
          appointmentCode: true,
          customerName: true,
          phone: true,
          deviceType: true,
          serviceGroup: true,
          status: true,
          createdAt: true,
          userId: true,
          verificationDiscountApplied: true,
          discountPercent: true,
        },
      }),
    ]);

    return NextResponse.json({
      appointments: rows,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[GET /api/appointments]", error);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
