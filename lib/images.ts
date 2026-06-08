import type { PartType } from "@/db/schema";

/**
 * Resolves a DB `imagePath` to a renderable URL, with graceful fallback to a
 * bundled repo image when no upload exists yet. Pure + client-safe (uses the
 * public Supabase URL only), so it works in both Server and Client Components.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "fixnow-media";

// Repo fallbacks (bundled in /public) keyed by part type + a generic default.
export const PART_FALLBACK: Record<PartType, string> = {
  RAM: "/images/part-ram.jpg",
  SSD: "/images/part-ssd.jpg",
  HDD: "/images/part-hdd.jpg",
  BATTERY: "/images/part-battery.jpg",
  ACCESSORY: "/images/part-accessory.jpg",
};

export const SERVICE_FALLBACK = "/images/service-laptop.jpg";

/** Build a public URL for a stored object path, or null if not configured. */
export function publicImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  // Already an absolute URL or a repo path → use as-is.
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  if (!SUPABASE_URL) return null;
  const base = SUPABASE_URL.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

/** Resolve a part image: uploaded path → URL, else repo fallback by type. */
export function resolvePartImage(
  imagePath: string | null | undefined,
  type: PartType,
): string {
  return publicImageUrl(imagePath) ?? PART_FALLBACK[type];
}

/** Resolve a service image: uploaded path → URL, else a provided/default repo image. */
export function resolveServiceImage(
  imagePath: string | null | undefined,
  fallback: string = SERVICE_FALLBACK,
): string {
  return publicImageUrl(imagePath) ?? fallback;
}
