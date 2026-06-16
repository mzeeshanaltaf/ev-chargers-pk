import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Graceful degradation: when Upstash isn't configured (local dev / preview),
// skip rate limiting entirely so the contact form still works — mirrors the
// `fetchChargers()` convention in charger-fetch.ts.
const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Singleton: 5 requests per IP per hour (sliding window).
const limiter = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "ratelimit:contact",
    })
  : null;

export async function checkRateLimit(ip: string): Promise<{ success: boolean }> {
  if (!limiter) return { success: true };
  try {
    const { success } = await limiter.limit(ip);
    return { success };
  } catch {
    // If Redis is unreachable, fail open so a real user is never blocked.
    return { success: true };
  }
}
