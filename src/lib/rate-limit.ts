import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Graceful degradation: when Upstash isn't configured (local dev / preview),
// skip rate limiting entirely so forms still work — mirrors the
// `fetchChargers()` convention in charger-fetch.ts.
const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Surface a misconfiguration in production so rate limiting doesn't silently
// disappear if the env vars are missing on the deployment.
if (!hasUpstash && process.env.NODE_ENV === "production") {
  console.warn(
    "[rate-limit] Upstash env vars are unset — rate limiting is DISABLED in production."
  );
}

const redis = hasUpstash ? Redis.fromEnv() : null;

function makeLimiter(prefix: string, limit: number, window: `${number} h`) {
  return redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, window),
        prefix,
      })
    : null;
}

// One sliding-window limiter per endpoint scope, keyed by client IP.
const limiters = {
  contact: makeLimiter("ratelimit:contact", 5, "1 h"),
  comments: makeLimiter("ratelimit:comments", 20, "1 h"),
  users: makeLimiter("ratelimit:users", 5, "1 h"),
};

export type RateLimitScope = keyof typeof limiters;

export async function checkRateLimit(
  ip: string,
  scope: RateLimitScope = "contact"
): Promise<{ success: boolean }> {
  const limiter = limiters[scope];
  if (!limiter) return { success: true };
  try {
    const { success } = await limiter.limit(ip);
    return { success };
  } catch {
    // If Redis is unreachable, fail open so a real user is never blocked.
    return { success: true };
  }
}

/**
 * Resolve the client IP for rate-limit keying. Prefers the Vercel-injected
 * `x-vercel-forwarded-for`, which the platform sets and the client can't spoof;
 * falls back to `x-forwarded-for` / `x-real-ip` for non-Vercel environments.
 */
export function getClientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
