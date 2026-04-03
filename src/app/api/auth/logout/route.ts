import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/jwt";

/** POST /api/auth/logout — Hapus session cookie */
export async function POST() {
  const response = NextResponse.json({ status: "success", message: "Logged out" });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
