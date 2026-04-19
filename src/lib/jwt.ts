import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.AUTH_SECRET || "fallback-secret-do-not-use-in-prod";
const JWT_EXPIRES_IN = "8h";

export interface JWTPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  instansiId: string | null;
  permissions: string[];
}

/** Bikin JWT token dari user data */
export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * In-memory LRU cache buat hasil decode JWT.
 * Setiap token di-hash dan cached selama TTL_MS agar verifikasi berikutnya
 * gak perlu re-decode HMAC signature dari awal.
 * 
 * Max 500 entries — safe buat server single-process (cPanel/Vercel).
 * Kalau token expired atau invalid, cache otomatis gak nyimpen.
 */
const TOKEN_CACHE_TTL_MS = 60 * 1000; // 1 menit — sweet spot antara freshness dan speed
const TOKEN_CACHE_MAX = 500;

interface CachedToken {
  payload: JWTPayload;
  expiresAt: number;
}

const tokenCache = new Map<string, CachedToken>();

/** Verify & decode JWT token, return null kalo invalid/expired */
export function verifyJWT(token: string): JWTPayload | null {
  // 1. Check cache dulu — O(1) lookup
  const cached = tokenCache.get(token);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.payload;
  }

  // 2. Cache miss → full HMAC verification
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as JWTPayload;

    // 3. Simpan ke cache
    if (tokenCache.size >= TOKEN_CACHE_MAX) {
      // Evict oldest entry (first key in Map = oldest insertion)
      const oldestKey = tokenCache.keys().next().value;
      if (oldestKey) tokenCache.delete(oldestKey);
    }

    tokenCache.set(token, {
      payload,
      expiresAt: Date.now() + TOKEN_CACHE_TTL_MS,
    });

    return payload;
  } catch {
    // Invalid/expired token — hapus dari cache kalau ada (e.g. expired mid-TTL)
    tokenCache.delete(token);
    return null;
  }
}

/** Cookie config yang konsisten buat semua auth endpoint */
export const SESSION_COOKIE_NAME = "ukp2sa-session";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development", // Default true — cPanel sering miss NODE_ENV
  sameSite: "strict" as const, // Strict > Lax untuk anti-CSRF
  path: "/",
  maxAge: 60 * 60 * 8, // 8 Hours
};
