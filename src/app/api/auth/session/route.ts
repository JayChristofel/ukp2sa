import { NextResponse } from "next/server";
import { verifyJWT, SESSION_COOKIE_NAME } from "@/lib/jwt";
import { cookies } from "next/headers";

/** GET /api/auth/session — Baca JWT dari cookie, return user data */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ user: null, isAuthenticated: false });
    }

    const payload = verifyJWT(token);

    if (!payload) {
      // Token expired atau invalid — hapus cookie
      const response = NextResponse.json({ user: null, isAuthenticated: false });
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    return NextResponse.json({
      user: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        instansiId: payload.instansiId,
        permissions: payload.permissions,
      },
      isAuthenticated: true,
    });
  } catch {
    return NextResponse.json({ user: null, isAuthenticated: false });
  }
}
