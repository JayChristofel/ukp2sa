import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { createAdminClient } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Missing credentials");
          return null;
        }

        // Pake Admin Client (tanpa cookies) — ini yang bikin auth gagal di production!
        const supabase = createAdminClient();
        const loginEmail = credentials.email.toString().toLowerCase();

        console.log("-----------------------------------------");
        console.log(`🔍 [AUTH] Checking: ${loginEmail}`);

        // 1. Fetch user dari database
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .ilike("email", loginEmail)
          .single();

        if (error) {
          console.error("❌ [AUTH] DB Error:", error.message, "| Code:", error.code);
          return null;
        }

        if (!user) {
          console.error("❌ [AUTH] User not found in DB");
          return null;
        }

        if (!user.password) {
          console.error("❌ [AUTH] User has no password field");
          return null;
        }

        console.log(`✅ [AUTH] User found: ${user.email} | Hash length: ${user.password.length}`);

        // 2. Verify password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) {
          console.warn("⚠️ [AUTH] Password mismatch for:", loginEmail);
          return null;
        }

        // 3. Fetch permissions separately
        let permissions: string[] = [];
        if (user.role) {
          const { data: roleData } = await supabase
            .from("roles")
            .select("permissions")
            .eq("id", user.role)
            .single();
          permissions = roleData?.permissions || [];
        }

        console.log("✅ [AUTH] Login successful:", user.email);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          instansiId: user.instansi_id || null,
          permissions,
        };
      },
    }),
  ],
});
