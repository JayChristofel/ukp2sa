import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * UKP2SA Global Rate Limiter (Scaling Ready)
 * Menggunakan Upstash Redis untuk koordinasi antar proses (cPanel/Vercel).
 * Fallback ke in-memory jika ENV tidak tersedia.
 */

// 1. Redis Client Initialization
let redis: Redis | null = null;
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
} else if (process.env.NODE_ENV === 'production') {
  console.error("❌ CRITICAL: UPSTASH_REDIS_REST_URL/TOKEN missing in production!");
}

// 2. Memory Store Fallback
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const memoryStore = new Map<string, RateLimitEntry>();

// 3. Multi-instance Cache (untuk handle limit/window yang beda-beda di tiap route)
const limiters = new Map<string, Ratelimit>();

export async function rateLimit(
  ip: string, 
  limit: number = 100, 
  windowMs: number = 15 * 60 * 1000
) {
  // --- REDIS PATH (Scaling) ---
  if (redis) {
    const windowSeconds = Math.floor(windowMs / 1000);
    const key = `${limit}-${windowSeconds}`;
    
    if (!limiters.has(key)) {
      limiters.set(key, new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        analytics: true,
        prefix: "@upstash/ratelimit/ukp2sa",
      }));
    }

    const { success, limit: total, remaining, reset } = await limiters.get(key)!.limit(ip);
    
    return {
      success,
      limit: total,
      remaining,
      reset
    };
  }

  // --- MEMORY FALLBACK PATH (Local Dev / Failover) ---
  const now = Date.now();
  const entry = memoryStore.get(ip);

  if (!entry || now > entry.resetTime) {
    const newEntry = { count: 1, resetTime: now + windowMs };
    memoryStore.set(ip, newEntry);
    return { success: true, limit, remaining: limit - 1, reset: newEntry.resetTime };
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, reset: entry.resetTime };
  }

  entry.count += 1;
  return { success: true, limit, remaining: limit - entry.count, reset: entry.resetTime };
}

// Cleanup Memory Store (Prevent Leaks in fallback mode)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of memoryStore.entries()) {
      if (now > entry.resetTime) memoryStore.delete(ip);
    }
  }, 30 * 60 * 1000);
}
