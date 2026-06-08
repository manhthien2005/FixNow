/**
 * One-time backfill: upload the bundled repo images to Supabase Storage and set
 * `imagePath` on parts (by type) and service_prices (by keyword) that don't have
 * one yet. Idempotent — skips rows that already have an imagePath, and reuses an
 * already-uploaded object for each source file.
 *
 * Run: npx tsx --env-file=.env.local scripts/backfill-images.ts
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, isNull } from "drizzle-orm";
import { Pool } from "pg";
import * as schema from "../db/schema";
import { parts, servicePrices, type PartType } from "../db/schema";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "fixnow-media";

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "✗ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const PART_IMAGE: Record<PartType, string> = {
  RAM: "part-ram.jpg",
  SSD: "part-ssd.jpg",
  HDD: "part-hdd.jpg",
  BATTERY: "part-battery.jpg",
  ACCESSORY: "part-accessory.jpg",
};

// Service keyword → repo image (mirrors the pricing-page categorisation).
const SERVICE_IMAGE_RULES: { test: RegExp; file: string }[] = [
  { test: /kiểm tra|vệ sinh|chẩn đoán/i, file: "service-diagnostics.jpg" },
  { test: /windows|virus|phần mềm|từ xa|teamviewer|anydesk|dữ liệu|rác/i, file: "service-software.jpg" },
  { test: /ram|ssd|hdd|pin|phần cứng|màn hình|bàn phím|sạc|nâng cấp/i, file: "service-upgrade.jpg" },
  { test: /mạng|wifi|máy in|văn phòng/i, file: "service-printer.jpg" },
];
const SERVICE_FALLBACK_FILE = "service-laptop.jpg";

const CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const uploadedCache = new Map<string, string>();

async function uploadRepoImage(file: string, folder: string): Promise<string> {
  const cacheKey = `${folder}/${file}`;
  const cached = uploadedCache.get(cacheKey);
  if (cached) return cached;

  const abs = path.join(process.cwd(), "public", "images", file);
  const buf = await readFile(abs);
  const ext = path.extname(file).toLowerCase();
  const dest = `${folder}/${path.basename(file)}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(dest, buf, {
      contentType: CONTENT_TYPE[ext] ?? "image/jpeg",
      upsert: true,
    });
  if (error) throw new Error(`upload ${dest}: ${error.message}`);

  uploadedCache.set(cacheKey, dest);
  return dest;
}

function serviceImageFor(name: string): string {
  return (
    SERVICE_IMAGE_RULES.find((r) => r.test.test(name))?.file ??
    SERVICE_FALLBACK_FILE
  );
}

async function main() {
  console.log(`Backfill images → bucket "${BUCKET}"`);

  const partRows = await db
    .select()
    .from(parts)
    .where(isNull(parts.imagePath));
  console.log(`  parts cần backfill: ${partRows.length}`);
  for (const row of partRows) {
    const dest = await uploadRepoImage(PART_IMAGE[row.type], "parts");
    await db.update(parts).set({ imagePath: dest }).where(eq(parts.id, row.id));
    console.log(`    ✓ ${row.name} → ${dest}`);
  }

  const serviceRows = await db
    .select()
    .from(servicePrices)
    .where(isNull(servicePrices.imagePath));
  console.log(`  dịch vụ cần backfill: ${serviceRows.length}`);
  for (const row of serviceRows) {
    const dest = await uploadRepoImage(
      serviceImageFor(row.serviceName),
      "services",
    );
    await db
      .update(servicePrices)
      .set({ imagePath: dest })
      .where(eq(servicePrices.id, row.id));
    console.log(`    ✓ ${row.serviceName} → ${dest}`);
  }

  console.log("✓ Backfill xong.");
  await pool.end();
}

main().catch((err) => {
  console.error("✗ Backfill lỗi:", err);
  process.exit(1);
});
