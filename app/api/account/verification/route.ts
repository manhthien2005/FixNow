import { NextRequest, NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db";
import { userVerifications } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  VERIFICATION_STORAGE_BUCKET,
  getStorageClient,
  isStorageConfigured,
} from "@/lib/storage";
import { verificationUploadFieldsSchema } from "@/lib/validations/verification";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    // One active submission per account: block if a PENDING or APPROVED
    // verification already exists.
    const existing = await db.query.userVerifications.findFirst({
      where: and(
        eq(userVerifications.userId, userId),
        inArray(userVerifications.status, ["PENDING", "APPROVED"]),
      ),
      columns: { status: true },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: "already_submitted",
          message:
            existing.status === "APPROVED"
              ? "Tài khoản của bạn đã được xác thực."
              : "Bạn đã có hồ sơ đang chờ duyệt.",
        },
        { status: 409 },
      );
    }

    if (!isStorageConfigured) {
      return NextResponse.json(
        {
          error: "storage_unconfigured",
          message:
            "Supabase Storage chưa được cấu hình để tải minh chứng xác thực.",
        },
        { status: 503 },
      );
    }

    const form = await req.formData();
    const file = form.get("proof");
    const parsed = verificationUploadFieldsSchema.safeParse({
      subject: form.get("subject"),
      organization: form.get("organization"),
      identifier: form.get("identifier") ?? "",
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "validation", message: "Thiếu ảnh minh chứng." },
        { status: 400 },
      );
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
      return NextResponse.json(
        { error: "invalid_type", message: "Chỉ chấp nhận JPG, PNG, WEBP, AVIF." },
        { status: 400 },
      );
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "too_large", message: "Ảnh tối đa 4MB." },
        { status: 400 },
      );
    }

    const client = getStorageClient();
    if (!client) {
      return NextResponse.json({ error: "storage_unconfigured" }, { status: 503 });
    }

    const ext = EXT[file.type] ?? "jpg";
    const path = `${userId}/${createId()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error } = await client.storage
      .from(VERIFICATION_STORAGE_BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false });

    if (error) {
      console.error("[POST /api/account/verification] storage error", error);
      return NextResponse.json(
        { error: "upload_failed", message: error.message },
        { status: 502 },
      );
    }

    const [row] = await db
      .insert(userVerifications)
      .values({
        userId,
        subject: parsed.data.subject,
        organization: parsed.data.organization,
        identifier: parsed.data.identifier || null,
        proofPath: path,
        status: "PENDING",
      })
      .returning({
        id: userVerifications.id,
        status: userVerifications.status,
      });

    return NextResponse.json({ verification: row }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/account/verification]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
