"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { createClient } from "@/lib/server";
import { UserStatus } from "@/lib/types";
import { sendMail } from "@/lib/mail";
import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Server Action buat handle logout
 */
export async function logOutAction() {
  await signOut({ redirectTo: "/auth/login" });
}

/**
 * Server Action buat handle login
 */
export async function authenticate(formData: FormData, lang: string = "id") {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: lang === "en" ? "Missing credentials." : "Email dan password wajib diisi." };
    }

    // 1. Sign In via NextAuth
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // 2. Fetch User Detail for Redirect Logic
    // We do this instead of relying on the client-side session fetch which is prone to race conditions
    const supabase = await createClient();
    const { data: user } = await supabase
      .from("users")
      .select("role, instansi_id")
      .eq("email", email)
      .single();

    if (!user) {
      return { error: lang === "en" ? "User session could not be established." : "Gagal menginisialisasi sesi user." };
    }

    // 3. Predetermine Redirect URL
    const ADMIN_ROLES = ['superadmin', 'admin', 'presiden', 'deputi', 'operator'];
    const PORTAL_ROLES = ['partner', 'ngo'];

    let redirectUrl = `/${lang}`;
    if (ADMIN_ROLES.includes(user.role)) {
      redirectUrl = `/${lang}/admin`;
    } else if (PORTAL_ROLES.includes(user.role)) {
      if (user.instansi_id) {
        redirectUrl = `/${lang}/portal/partner/id?id=${user.instansi_id}`;
      } else {
        return { error: lang === "en" ? "Account not linked to any agency." : "Akun belum terhubung ke instansi." };
      }
    }

    return { success: true, redirectUrl };
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT") || error?.message === "NEXT_REDIRECT") {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: lang === "en" ? "Invalid email or password." : "Email atau password salah." };
        default:
          return { error: lang === "en" ? "Authentication failed." : "Gagal masuk." };
      }
    }
    console.error("⛔ [Auth Action Error]:", error);
    return { error: lang === "en" ? "Internal server error." : "Terjadi kesalahan internal." };
  }
}

/**
 * Server Action buat Registrasi User baru
 */
export async function registerUser(formData: FormData, lang: string = "id") {
  try {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { error: lang === "en" ? "All fields are required." : "Semua data wajib diisi." };
    }

    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
    if (existingUser) {
      return { error: lang === "en" ? "Email already registered." : "Email sudah terdaftar." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { error } = await supabase.from('users').insert([
      {
        name,
        email,
        password: hashedPassword,
        role: "operator", 
        status: UserStatus.INACTIVE,
      }
    ]);

    if (error) throw error;

    return { success: true, message: lang === "en" ? "Registration success! Check your email." : "Registrasi berhasil! Menunggu persetujuan admin." };
  } catch (error) {
    console.error("⛔ [Register Error]:", error);
    return { error: lang === "en" ? "Failed to register." : "Gagal mendaftar." };
  }
}

/**
 * Server Action buat Forgot Password (Magic Link)
 */
export async function forgotPasswordAction(formData: FormData, lang: string = "id") {
  try {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    
    if (!email) return { error: lang === "en" ? "Email is required." : "Email wajib diisi." };
    
    // 1. Cek user exists
    const { data: user } = await supabase.from('users').select('name').eq('email', email).single();
    if (!user) {
      return { success: true, message: lang === "en" ? "Reset link sent if account exists." : "Link reset dikirim jika email terdaftar." };
    }

    // 2. Bikin Token & Expiry (1 Jam)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000).toISOString();
    
    const { error: resetError } = await supabase
      .from('password_resets')
      .upsert({ email, token, expires_at: expiresAt }, { onConflict: 'email' });

    if (resetError) throw resetError;

    // 3. Kirim Email
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/${lang}/auth/reset-password?token=${token}`;

    const subject = lang === "en" ? "Reset Your Password - UKP2SA" : "Reset Password Akun UKP2SA Lo";
    const html = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #000;">⚠️ Permintaan Reset Password</h2>
        <p>Halo <b>${user.name}</b>,</p>
        <p>Seseorang minta link buat reset password akun UKP2SA lo.</p>
        <div style="padding: 20px 0;">
          <a href="${resetLink}" style="background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            GANTI PASSWORD SEKARANG
          </a>
        </div>
        <p>Atau copy link ini ke browser lo:</p>
        <p style="color: #666; font-size: 12px;">${resetLink}</p>
        <hr style="border: 0.5px solid #eee; margin: 20px 0;">
        <p style="font-size: 11px; color: #999;">Link ini valid selama 1 jam. Kalo bukan elo yang minta, abaikan aja email ini.</p>
      </div>
    `;

    await sendMail({ to: email, subject, html });

    return { success: true, message: lang === "en" ? "Reset link sent to your email." : "Link reset berhasil dikirim ke email lo." };
  } catch (error) {
    console.error("⛔ [Forgot Password Error]:", error);
    return { error: lang === "en" ? "Failed to process request." : "Gagal memproses permintaan." };
  }
}

/**
 * Server Action buat Reset Password (Verification)
 */
export async function resetPasswordAction(formData: FormData, lang: string = "id") {
  try {
    const supabase = await createClient();
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    
    if (!token || !password) {
      return { error: lang === "en" ? "Missing required data." : "Data tidak lengkap." };
    }

    // 1. Validasi Token
    const { data: resetEntry } = await supabase.from('password_resets').select('*').eq('token', token).single();
    if (!resetEntry || new Date(resetEntry.expires_at) < new Date()) {
      return { error: lang === "en" ? "Token invalid or expired." : "Token tidak sah atau sudah kedaluwarsa." };
    }

    // 2. Update Password User
    const hashedPassword = await bcrypt.hash(password, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', resetEntry.email);

    if (updateError) throw updateError;

    // 3. Hapus Token Reset
    await supabase.from('password_resets').delete().eq('token', token);

    return { success: true, message: lang === "en" ? "Password updated successfully!" : "Password lo berhasil diperbarui!" };
  } catch (error) {
    console.error("⛔ [Reset Password Error]:", error);
    return { error: lang === "en" ? "Something went wrong." : "Terjadi kesalahan sistem." };
  }
}
