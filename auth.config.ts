import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible NextAuth config (no DB / no bcrypt).
 * Used by middleware which runs on the Edge runtime.
 * The full config (auth + providers) lives in lib/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CUSTOMER" | "ADMIN";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnCustomerProtected =
        nextUrl.pathname.startsWith("/my-appointments") ||
        nextUrl.pathname.startsWith("/account") ||
        nextUrl.pathname.startsWith("/book");

      if (isOnAdmin) {
        if (isLoggedIn && role === "ADMIN") return true;
        return false;
      }
      if (isOnCustomerProtected) {
        return isLoggedIn;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
