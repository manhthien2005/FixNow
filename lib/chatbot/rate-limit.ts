import "server-only";

// In-memory sliding-window rate limiter. Single-instance only (resets on
// redeploy, not shared across instances) — acceptable for this project per
// stack rules (no Redis). See docs/decisions.md 2026-06-10.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const MAX_TRACKED_IPS = 5_000;

const hits = new Map<string, number[]>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Bound memory: drop everything if an attacker rotates IPs.
  if (hits.size > MAX_TRACKED_IPS) hits.clear();

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return false;
  }

  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
