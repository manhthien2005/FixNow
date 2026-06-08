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
        nextUrl.pathname.startsWith("/account");
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      // Logged-in users on auth pages → redirect to callbackUrl or /
      if (isOnAuthPage) {
        if (isLoggedIn) {
          const callbackUrl = nextUrl.searchParams.get("callbackUrl") ?? "/";
          return Response.redirect(new URL(callbackUrl, nextUrl));
        }
        return true;
      }

      if (isOnAdmin) {
        if (isLoggedIn && role === "ADMIN") return true;
        // Logged-in non-admin → send to home instead of login (better UX)
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return false;
      }
      if (isOnCustomerProtected) {
        return isLoggedIn;
      }
      // /booking is intentionally NOT protected — hybrid per docs/decisions.md
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
