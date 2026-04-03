import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { signJWT } from "@/lib/jwt";
import crypto from "crypto";

/** POST /api/auth/refresh — Refresh access token (Mobile) */
export async function POST(request: Request) {
  try {
    const { refreshToken: oldRefreshToken } = await request.json();

    if (!oldRefreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Validate refresh token
    const { data: storedToken, error } = await supabase
      .from("refresh_tokens")
      .select("*, users(*)")
      .eq("token", oldRefreshToken)
      .eq("is_revoked", false)
      .single();

    if (error || !storedToken) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
    }

    // Cek expiry
    if (new Date(storedToken.expires_at) < new Date()) {
      await supabase.from("refresh_tokens").update({ is_revoked: true }).eq("token", oldRefreshToken);
      return NextResponse.json({ error: "Refresh token expired. Please login again." }, { status: 401 });
    }

    const user = storedToken.users;

    // 2. Fetch permissions
    let permissions: string[] = [];
    if (user.role) {
      const { data: roleData } = await supabase
        .from("roles")
        .select("permissions")
        .eq("id", user.role)
        .single();
      permissions = roleData?.permissions || [];
    }

    // 3. Generate new access token (custom JWT)
    const newAccessToken = signJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      instansiId: user.instansi_id || null,
      permissions,
    });

    // 4. Rotate refresh token
    const newRefreshToken = crypto.randomBytes(40).toString("hex");
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 30);

    await supabase.from("refresh_tokens").update({ is_revoked: true }).eq("token", oldRefreshToken);
    await supabase.from("refresh_tokens").insert([
      { user_id: user.id, token: newRefreshToken, expires_at: newExpiresAt.toISOString() },
    ]);

    return NextResponse.json({
      status: "success",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 28800,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, instansiId: user.instansi_id, permissions },
    });
  } catch (err: any) {
    console.error("⛔ [Refresh API Error]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
