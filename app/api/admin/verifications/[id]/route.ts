import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { userVerifications } from "@/db/schema";
import { auth } from "@/lib/auth";
import { verificationReviewSchema } from "@/lib/validations/admin";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN" || !session.user.id) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body: unknown = await req.json();
    const parsed = verificationReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Only PENDING submissions can be reviewed — block re-review of an
    // already-decided record (UI disables it, but guard the API too).
    const existing = await db.query.userVerifications.findFirst({
      where: eq(userVerifications.id, id),
      columns: { id: true, status: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (existing.status !== "PENDING") {
      return NextResponse.json({ error: "already_reviewed" }, { status: 409 });
    }

    const now = new Date();
    const [row] = await db
      .update(userVerifications)
      .set({
        status: parsed.data.status,
        reviewerId: session.user.id,
        rejectReason:
          parsed.data.status === "REJECTED"
            ? parsed.data.rejectReason?.trim() ?? null
            : null,
        reviewedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(userVerifications.id, id),
          eq(userVerifications.status, "PENDING"),
        ),
      )
      .returning({
        id: userVerifications.id,
        status: userVerifications.status,
      });

    if (!row) {
      return NextResponse.json({ error: "conflict" }, { status: 409 });
    }

    return NextResponse.json({ verification: row }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/admin/verifications/:id]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
