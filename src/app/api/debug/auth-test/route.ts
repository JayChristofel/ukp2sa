import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

/**
 * Debug endpoint buat nge-cek koneksi Supabase dan validasi password hash.
 * 
 * CARA PAKE:
 * GET https://ukp2sa.id/api/debug/auth-test?email=admin@ukp2sa.go.id
 * 
 * PENTING: Hapus endpoint ini setelah debugging selesai!
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Parameter ?email= diperlukan" }, { status: 400 });
    }

    // 1. Cek environment variables
    const envCheck = {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
      NODE_ENV: process.env.NODE_ENV,
    };

    // 2. Cek koneksi database
    const supabase = createAdminClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, role, password")
      .ilike("email", email)
      .single();

    if (error) {
      return NextResponse.json({
        status: "DB_ERROR",
        envCheck,
        dbError: error.message,
        dbCode: error.code,
        hint: error.hint,
      });
    }

    if (!user) {
      return NextResponse.json({
        status: "USER_NOT_FOUND",
        envCheck,
        hint: "Email tidak ditemukan di tabel users",
      });
    }

    // 3. Cek format password hash
    const passwordInfo = {
      hasPassword: !!user.password,
      passwordLength: user.password?.length || 0,
      looksLikeBcrypt: user.password?.startsWith("$2") || false,
      bcryptPrefix: user.password?.substring(0, 7) || "N/A",
    };

    // 4. Test bcrypt compare dengan password hardcoded "password123"
    let bcryptTestResult = "SKIPPED";
    if (user.password && passwordInfo.looksLikeBcrypt) {
      // Coba compare dengan beberapa password umum buat testing
      const testPassword = "password123";
      const testResult = await bcrypt.compare(testPassword, user.password);
      bcryptTestResult = testResult ? "MATCH (password123)" : "NO_MATCH";
    } else if (user.password && !passwordInfo.looksLikeBcrypt) {
      bcryptTestResult = "PASSWORD_NOT_HASHED (This is the problem!)";
    }

    return NextResponse.json({
      status: "OK",
      envCheck,
      userFound: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      passwordInfo,
      bcryptTestResult,
      conclusion: !passwordInfo.looksLikeBcrypt
        ? "🚨 Password di database BUKAN hash bcrypt! Harus di-hash ulang."
        : bcryptTestResult === "NO_MATCH"
        ? "✅ Hash valid, tapi password test 'password123' gak cocok. Coba password asli."
        : "✅ Koneksi dan hash OK.",
    });
  } catch (err: any) {
    return NextResponse.json({
      status: "FATAL_ERROR",
      error: err.message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    }, { status: 500 });
  }
}
