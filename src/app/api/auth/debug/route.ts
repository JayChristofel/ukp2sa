import { NextResponse } from "next/server";

/**
 * Debug endpoint ini sudah DIHAPUS karena alasan keamanan.
 * Endpoint ini pernah mengekspos seluruh daftar email user,
 * dan bahkan bisa INSERT user baru tanpa autentikasi.
 *
 * Dihapus pada: 13 April 2026 — Remediasi Pentest V2
 */
export async function GET() {
  return NextResponse.json(
    { error: "This endpoint has been permanently disabled for security reasons." },
    { status: 410 }
  );
}
