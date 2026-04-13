import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";

/** POST /api/auth/register — Registrasi user baru */
export async function POST(request: Request) {
  try {
    // Rate limiting: max 3 register per 15 menit per IP
    const xff = request.headers.get("x-forwarded-for");
    const cfIp = request.headers.get("cf-connecting-ip");
    const ip = cfIp || (xff ? xff.split(",")[0].trim() : "127.0.0.1");

    const rl = await rateLimit(ip, 3, 15 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Format permintaan tidak valid." },
        { status: 400 }
      );
    }

    const { name, email, password, lang = "id" } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: lang === "en" ? "All fields are required." : "Semua data wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Cek duplikat email
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .ilike("email", email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: lang === "en" ? "Email already registered." : "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    // Hash password & insert
    const hashedPassword = await bcrypt.hash(password, 10);
    const { error } = await supabase.from("users").insert([
      {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "operator",
        status: "INACTIVE",
      },
    ]);

    if (error) throw error;

    return NextResponse.json({
      status: "success",
      message: lang === "en"
        ? "Registration successful! Awaiting admin approval."
        : "Registrasi berhasil! Menunggu persetujuan admin.",
    }, { status: 201 });
  } catch (err: any) {
    console.error("⛔ [Register Error]:", err);
    return NextResponse.json({ error: "Terjadi kesalahan. Silakan coba lagi." }, { status: 500 });
  }
}
