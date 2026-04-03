import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { signJWT, SESSION_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/jwt";

/** Redirect URL resolver berdasarkan role user */
function getRedirectUrl(role: string, instansiId: string | null, lang: string): string {
  const ADMIN_ROLES = ["superadmin", "admin", "presiden", "deputi", "operator"];
  const PORTAL_ROLES = ["partner", "ngo"];

  if (ADMIN_ROLES.includes(role)) return `/${lang}/admin`;
  if (PORTAL_ROLES.includes(role) && instansiId) return `/${lang}/portal/partner/id?id=${instansiId}`;
  return `/${lang}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, lang = "id", platform } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: lang === "en" ? "Email and password are required." : "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const loginEmail = email.toString().toLowerCase();

    // 1. Fetch user + role permissions
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .ilike("email", loginEmail)
      .single();

    if (error || !user) {
      console.error("❌ [AUTH] User not found:", loginEmail, error?.message);
      return NextResponse.json(
        { error: lang === "en" ? "Invalid email or password." : "Email atau password salah." },
        { status: 401 }
      );
    }

    if (!user.password) {
      console.error("❌ [AUTH] No password set for:", loginEmail);
      return NextResponse.json(
        { error: lang === "en" ? "Invalid email or password." : "Email atau password salah." },
        { status: 401 }
      );
    }

    // 2. Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.warn("⚠️ [AUTH] Password mismatch:", loginEmail);
      return NextResponse.json(
        { error: lang === "en" ? "Invalid email or password." : "Email atau password salah." },
        { status: 401 }
      );
    }

    // 3. Fetch permissions dari tabel roles
    let permissions: string[] = [];
    if (user.role) {
      const { data: roleData } = await supabase
        .from("roles")
        .select("permissions")
        .eq("id", user.role)
        .single();
      permissions = roleData?.permissions || [];
    }

    // 4. Generate JWT Token
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      instansiId: user.instansi_id || null,
      permissions,
    };

    const accessToken = signJWT(tokenPayload);
    const isMobile = platform === "mobile";

    console.log(`✅ [AUTH] Login success: ${user.email} | Platform: ${isMobile ? "Mobile" : "Web"}`);

    // --- MOBILE: Return tokens di body ---
    if (isMobile) {
      const refreshToken = crypto.randomBytes(40).toString("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await supabase.from("refresh_tokens").insert([
        { user_id: user.id, token: refreshToken, expires_at: expiresAt.toISOString() },
      ]);

      return NextResponse.json({
        status: "success",
        accessToken,
        refreshToken,
        expiresIn: 28800,
        user: tokenPayload,
      });
    }

    // --- WEB: Set HTTP-Only Cookie + return redirect URL ---
    const redirectUrl = getRedirectUrl(user.role, user.instansi_id, lang);

    const response = NextResponse.json({
      status: "success",
      user: tokenPayload,
      redirectUrl,
    });

    response.cookies.set(SESSION_COOKIE_NAME, accessToken, COOKIE_OPTIONS);

    return response;
  } catch (err: any) {
    console.error("⛔ [AUTH API Error]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
