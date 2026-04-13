import { NextResponse } from "next/server";

/**
 * Debug endpoint ini sudah DIHAPUS karena alasan keamanan.
 * Endpoint ini pernah mengekspos password hash, bcrypt validation,
 * dan environment variable status ke publik TANPA autentikasi.
 *
 * Dihapus pada: 12 April 2026 — Remediasi VULN-001
 */
export async function GET() {
  return NextResponse.json(
    { error: "This endpoint has been permanently disabled for security reasons." },
    { status: 410 } // 410 Gone
  );
}
