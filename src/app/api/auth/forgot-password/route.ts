import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendMail } from "@/lib/mail";
import crypto from "crypto";

/** POST /api/auth/forgot-password — Kirim email reset password */
export async function POST(request: Request) {
  try {
    const { email, lang = "id" } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: lang === "en" ? "Email is required." : "Email wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Cek user exists (response tetap sama biar gak bisa di-enumerate)
    const { data: user } = await supabase
      .from("users")
      .select("name")
      .ilike("email", email.toLowerCase())
      .single();

    if (!user) {
      return NextResponse.json({
        status: "success",
        message: lang === "en" ? "Reset link sent if account exists." : "Link reset dikirim jika email terdaftar.",
      });
    }

    // Generate token & save
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    await supabase
      .from("password_resets")
      .upsert({ email: email.toLowerCase(), token, expires_at: expiresAt }, { onConflict: "email" });

    // Kirim email
    const baseUrl = process.env.NEXTAUTH_URL || "https://ukp2sa.id";
    const resetLink = `${baseUrl}/${lang}/auth/reset-password?token=${token}`;

    await sendMail({
      to: email,
      subject: lang === "en" ? "Reset Your Password - UKP2SA" : "Reset Password Akun UKP2SA",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2>⚠️ Permintaan Reset Password</h2>
          <p>Halo <b>${user.name}</b>,</p>
          <p>Klik tombol di bawah untuk reset password akun UKP2SA.</p>
          <div style="padding: 20px 0;">
            <a href="${resetLink}" style="background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              GANTI PASSWORD SEKARANG
            </a>
          </div>
          <p style="font-size: 11px; color: #999;">Link ini valid selama 1 jam.</p>
        </div>
      `,
    });

    return NextResponse.json({
      status: "success",
      message: lang === "en" ? "Reset link sent to your email." : "Link reset berhasil dikirim ke email.",
    });
  } catch (err: any) {
    console.error("⛔ [Forgot Password Error]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
