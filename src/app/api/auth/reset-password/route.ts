import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

/** POST /api/auth/reset-password — Set password baru dari token */
export async function POST(request: Request) {
  try {
    const { token, password, lang = "id" } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: lang === "en" ? "Missing required data." : "Data tidak lengkap." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Validasi token
    const { data: resetEntry } = await supabase
      .from("password_resets")
      .select("email, expires_at")
      .eq("token", token)
      .single();

    if (!resetEntry || new Date(resetEntry.expires_at) < new Date()) {
      return NextResponse.json(
        { error: lang === "en" ? "Token invalid or expired." : "Token tidak sah atau sudah kedaluwarsa." },
        { status: 401 }
      );
    }

    // 2. Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .ilike("email", resetEntry.email);

    if (updateError) throw updateError;

    // 3. Hapus token reset
    await supabase.from("password_resets").delete().eq("token", token);

    return NextResponse.json({
      status: "success",
      message: lang === "en" ? "Password updated successfully!" : "Password berhasil diperbarui!",
    });
  } catch (err: any) {
    console.error("⛔ [Reset Password Error]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
