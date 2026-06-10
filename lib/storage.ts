import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Storage — server-only. Uploads use the service-role key (never sent
 * to the client). The bucket is public, so reads go through a plain public URL.
 *
 * Everything degrades gracefully: if env vars are missing, `isStorageConfigured`
 * is false and callers fall back to bundled repo images. This lets the app run
 * before the bucket/keys exist, and surfaces a clear error on upload attempts.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? "fixnow-media";
export const VERIFICATION_STORAGE_BUCKET =
  process.env.SUPABASE_VERIFICATION_BUCKET ?? "fixnow-verifications";

export const isStorageConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

let cachedClient: SupabaseClient | null = null;

/** Returns the admin Storage client, or null if env vars are not set. */
export function getStorageClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return null;
  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedClient;
}

/** Public URL for a stored object path (e.g. "parts/abc.jpg"). */
export function storagePublicUrl(path: string): string | null {
  if (!SUPABASE_URL) return null;
  const base = SUPABASE_URL.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

/** Short-lived signed URL for private verification proof images. */
export async function verificationProofSignedUrl(
  path: string,
  expiresInSeconds = 10 * 60,
): Promise<string | null> {
  const client = getStorageClient();
  if (!client) return null;

  const { data, error } = await client.storage
    .from(VERIFICATION_STORAGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error) return null;
  return data.signedUrl;
}

/** Host of the Supabase project (for next.config remotePatterns), or null. */
export function storageHost(): string | null {
  if (!SUPABASE_URL) return null;
  try {
    return new URL(SUPABASE_URL).host;
  } catch {
    return null;
  }
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB
