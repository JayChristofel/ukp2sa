import type { NextAuthConfig } from "next-auth";

// Basic config for Edge compatibility
export const authConfig: NextAuthConfig = {
  providers: [], 
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.instansiId = (user as any).instansiId || null;
        token.permissions = (user as any).permissions || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session.user as any).instansiId = token.instansiId as string;
        (session.user as any).permissions = token.permissions as string[];
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
} satisfies NextAuthConfig;
