import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { encode } from "next-auth/jwt";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { refreshToken: oldRefreshToken } = await request.json();

    if (!oldRefreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Validate the refresh token against the database
    const { data: storedToken, error } = await supabase
      .from("refresh_tokens")
      .select("*, users(*)")
      .eq("token", oldRefreshToken)
      .eq("is_revoked", false)
      .single();

    if (error || !storedToken) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Check if the token is expired
    if (new Date(storedToken.expires_at) < new Date()) {
       // Auto-revoke expired tokens for safety
       await supabase.from("refresh_tokens").update({ is_revoked: true }).eq("token", oldRefreshToken);
       
       return NextResponse.json(
        { error: "Refresh token has expired. Please login again." },
        { status: 401 }
      );
    }

    const user = storedToken.users;

    // --- ACCESSS TOKEN GENERATION ---
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      instansiId: user.instansi_id || null,
    };

    const isProd = process.env.NODE_ENV === "production";
    const salt = isProd ? "__Secure-authjs.session-token" : "authjs.session-token";

    // Generate new Access Token
    const newAccessToken = await encode({
      token: tokenPayload,
      secret: process.env.AUTH_SECRET as string,
      salt: salt,
      maxAge: 3600, // 1 Hour for mobile
    });

    // --- REFRESH TOKEN ROTATION (ELITE SECURITY) ---
    // Invalidate the old token and generate a new one
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 30); // 30 Days expiry

    // 1. Revoke the old one
    await supabase.from("refresh_tokens").update({ is_revoked: true }).eq("token", oldRefreshToken);

    // 2. Insert the new one
    const { error: refreshError } = await supabase
      .from("refresh_tokens")
      .insert([
        {
          user_id: user.id,
          token: newRefreshToken,
          expires_at: newExpiresAt.toISOString(),
        }
      ]);

    if (refreshError) throw refreshError;

    return NextResponse.json({
      status: "success",
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        instansiId: user.instansi_id,
      },
    });
  } catch (err: any) {
    console.error("⛔ [Refresh API Error]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
