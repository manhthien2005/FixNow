import "server-only";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { appSettings } from "@/db/schema";

export const VERIFICATION_DISCOUNT_KEY = "verification_discount_percent";
export const DEFAULT_VERIFICATION_DISCOUNT_PERCENT = 10;

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_VERIFICATION_DISCOUNT_PERCENT;
  return Math.min(100, Math.max(0, Math.round(value)));
}

// Returns the admin-configured verified-discount percent (0–100).
// Falls back to the default if unset or if the table is missing (pre-migration).
export async function getVerificationDiscountPercent(): Promise<number> {
  try {
    const row = await db.query.appSettings.findFirst({
      where: eq(appSettings.key, VERIFICATION_DISCOUNT_KEY),
      columns: { value: true },
    });
    if (!row) return DEFAULT_VERIFICATION_DISCOUNT_PERCENT;
    const parsed = Number(row.value);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 100
      ? parsed
      : DEFAULT_VERIFICATION_DISCOUNT_PERCENT;
  } catch {
    return DEFAULT_VERIFICATION_DISCOUNT_PERCENT;
  }
}

export async function setVerificationDiscountPercent(
  percent: number,
): Promise<number> {
  const value = clampPercent(percent);
  const now = new Date();
  await db
    .insert(appSettings)
    .values({ key: VERIFICATION_DISCOUNT_KEY, value: String(value), updatedAt: now })
    .onConflictDoUpdate({
      target: appSettings.key,
      set: { value: String(value), updatedAt: now },
    });
  return value;
}
