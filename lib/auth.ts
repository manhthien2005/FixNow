import "server-only";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { authConfig } from "@/auth.config";
import { normalizePhoneValue } from "@/lib/input-normalizers";

const credentialsSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "SĐT hoặc email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { identifier, password } = parsed.data;
        const normalizedIdentifier = identifier.includes("@")
          ? identifier.trim().toLowerCase()
          : normalizePhoneValue(identifier);

        const user = await db.query.users.findFirst({
          where: or(
            eq(users.phone, normalizedIdentifier),
            eq(users.email, normalizedIdentifier),
          ),
          columns: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
            passwordHash: true,
          },
        });

        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});

export const { GET, POST } = handlers;
