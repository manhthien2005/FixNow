import { NextRequest, NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";

import { auth } from "@/lib/auth";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  STORAGE_BUCKET,
  getStorageClient,
  isStorageConfigured,
} from "@/lib/storage";

const FOLDERS = ["parts", "services"] as const;
type Folder = (typeof FOLDERS)[number];

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

// POST /api/admin/upload  (multipart: file, folder) → { path }
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    if (!isStorageConfigured) {
      return NextResponse.json(
        {
          error: "storage_unconfigured",
          message:
            "Supabase Storage chưa được cấu hình. Thêm NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY vào .env.local.",
        },
        { status: 503 },
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    const folderRaw = form.get("folder");
    const folder: Folder = FOLDERS.includes(folderRaw as Folder)
      ? (folderRaw as Folder)
      : "parts";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "validation", message: "Thiếu file ảnh." },
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
    const path = `${folder}/${createId()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: false });

    if (error) {
      console.error("[POST /api/admin/upload] storage error", error);
      return NextResponse.json(
        { error: "upload_failed", message: error.message },
        { status: 502 },
      );
    }

    return NextResponse.json({ path }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/upload]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
