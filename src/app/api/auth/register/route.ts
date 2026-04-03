import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

/** POST /api/auth/register — Registrasi user baru */
export async function POST(request: Request) {
  try {
    const { name, email, password, lang = "id" } = await request.json();

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
