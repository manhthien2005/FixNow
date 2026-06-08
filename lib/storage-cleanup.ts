import "server-only";
import { STORAGE_BUCKET, getStorageClient } from "@/lib/storage";

/**
 * Best-effort removal of a stored object. Never throws — a failed cleanup
 * (e.g. storage unconfigured, already gone) must not block the DB write.
 * Skips repo/absolute paths (only manages bucket-relative keys).
 */
export async function removeStoredImage(
  path: string | null | undefined,
): Promise<void> {
  if (!path) return;
  if (path.startsWith("/") || /^https?:\/\//.test(path)) return;
  const client = getStorageClient();
  if (!client) return;
  try {
    await client.storage.from(STORAGE_BUCKET).remove([path]);
  } catch (error) {
    console.error("[storage cleanup] failed to remove", path, error);
  }
}
