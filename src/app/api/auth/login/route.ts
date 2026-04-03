import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";
import { encode } from "next-auth/jwt";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Fetch user from database with role permissions
    const { data: user, error } = await supabase
      .from("users")
      .select("*, roles(permissions)")
      .eq("email", email)
      .single();

    if (error || !user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // --- ACCESS TOKEN GENERATION ---
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      instansiId: user.instansi_id || null,
      permissions: (user as any).roles?.permissions || [],
    };

    const isProd = process.env.NODE_ENV === "production";
    const salt = isProd ? "__Secure-authjs.session-token" : "authjs.session-token";

    // Generate JWT Access Token (Short-lived by strategy, but let's assume default maxAge)
    const accessToken = await encode({
      token: tokenPayload,
      secret: process.env.AUTH_SECRET as string,
      salt: salt,
      maxAge: 3600, // 1 Hour for mobile
    });

    // --- REFRESH TOKEN GENERATION ---
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 Days expiry

    // Save refresh token to database
    const { error: refreshError } = await supabase
      .from("refresh_tokens")
      .insert([
        {
          user_id: user.id,
          token: refreshToken,
          expires_at: expiresAt.toISOString(),
        }
      ]);

    if (refreshError) throw refreshError;

    return NextResponse.json({
      status: "success",
      message: "Authentication successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: 3600,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        instansiId: user.instansi_id,
        permissions: (user as any).roles?.permissions || [],
      },
    });
  } catch (err: any) {
    console.error("⛔ [Mobile Login API Error]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
