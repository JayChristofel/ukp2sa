import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { createClient } from "@/lib/server";
import bcrypt from "bcryptjs";

/**
 * MOBILE LOGIN API - SUPABASE VERSION
 * Khusus untuk Native Apps (iOS/Android/Flutter/React Native)
 * Mengembalikan Full Bearer Token (JWT) dalam bentuk JSON
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Cari user di Supabase (Include password untuk verifikasi)
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !user || !user.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2. Verifikasi Password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Persiapkan payload untuk Token 
    // Sesuaikan mapping field Supabase: instansi_id -> instansiId
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      instansiId: user.instansi_id || null,
    };

    // 4. Encode Token menggunakan AUTH_SECRET 
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      throw new Error("AUTH_SECRET is not defined in environment variables");
    }

    const token = await encode({
      token: tokenPayload,
      secret: secret,
      salt: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      maxAge: 30 * 24 * 60 * 60, // 30 Hari
    });

    // --- AUDIT LOG ---
    const { AuditService } = await import("@/services/AuditService");
    await AuditService.log({
      action: "MOBILE_LOGIN",
      module: "AUTH",
      details: `User ${user.email} logged in via Mobile App`,
      meta: { device: "NativeApp" }
    });

    // 5. Response JSON
    return NextResponse.json({
      success: true,
      user: tokenPayload,
      token: token, 
    });

  } catch (error: any) {
    console.error("[MOBILE_AUTH_ERROR]:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
