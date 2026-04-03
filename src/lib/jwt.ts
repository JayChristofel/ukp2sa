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

/** Verify & decode JWT token, return null kalo invalid/expired */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/** Cookie config yang konsisten buat semua auth endpoint */
export const SESSION_COOKIE_NAME = "ukp2sa-session";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 8, // 8 Hours
};
