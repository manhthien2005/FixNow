# Getting Started — FixNow

Hướng dẫn khởi tạo dự án từ đầu. Chạy theo thứ tự.

## Yêu cầu môi trường

- **Node.js** ≥ 18.17 (khuyến nghị 20 LTS).
- **PostgreSQL** ≥ 14 chạy local (hoặc Neon/Supabase cloud).
- **npm** (hoặc pnpm).
- **Git**.

```bash
node --version
npm --version
psql --version
```

## Bước 1: Khởi tạo Next.js

```bash
cd D:\FixNow
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint --use-npm
```

Khi prompt confirm overwrite CLAUDE.md / docs/ → **CHỌN NO**, giữ nguyên file đã có.

## Bước 2: Cài dependencies

```bash
# Auth
npm i next-auth@beta bcryptjs
npm i -D @types/bcryptjs

# Drizzle ORM + Postgres
npm i drizzle-orm pg @paralleldrive/cuid2
npm i -D drizzle-kit @types/pg tsx

# Form + validation
npm i react-hook-form zod @hookform/resolvers

# Icons
npm i lucide-react

# server-only marker
npm i server-only
```

## Bước 3: Khởi tạo Drizzle

Tạo `drizzle.config.ts` ở root:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  strict: true,
  verbose: true,
});
```

Copy schema từ `docs/database-schema.md` vào `db/schema.ts`.

Tạo `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/fixnow?schema=public"
NEXTAUTH_SECRET="change-me-in-prod"
NEXTAUTH_URL="http://localhost:3000"
```

Generate secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Tạo DB nếu chưa có:
```bash
psql -U postgres -c "CREATE DATABASE fixnow;"
```

Chạy migration đầu tiên:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Bước 4: DB client singleton

`db/index.ts`:

```ts
import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const globalForDb = globalThis as unknown as { pool?: Pool };
const pool = globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
```

## Bước 5: shadcn/ui

```bash
npx shadcn@latest init
```

Khi prompt:
- Style: `new-york`
- Base color: `slate`
- CSS variables: `yes`
- React Server Components: `yes`
- Import alias: `@/*`

Cài components cơ bản:

```bash
npx shadcn@latest add button input label form card select textarea dialog dropdown-menu table badge toast sheet
```

## Bước 6: NextAuth

`lib/auth.ts`:

```ts
import 'server-only';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { identifier: {}, password: {} },
      async authorize(credentials) {
        const { identifier, password } = credentials as { identifier: string; password: string };
        const user = await db.query.users.findFirst({
          where: or(eq(users.phone, identifier), eq(users.email, identifier)),
        });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.fullName, email: user.email ?? undefined, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: { signIn: '/login' },
});
```

`app/api/auth/[...nextauth]/route.ts`:

```ts
export { GET, POST } from '@/lib/auth';
```

## Bước 7: Seed

`db/seed.ts` — template trong skill `seed-fixtures`.

Thêm vào `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx db/seed.ts"
  }
}
```

Chạy:

```bash
npm run db:seed
```

## Bước 8: Dev server

```bash
npm run dev
```

Mở http://localhost:3000.

## Bước tiếp theo (build order)

1. Layout chung + navbar + footer + floating contact.
2. Trang chủ (`/`) — hero + 6 bước.
3. Trang dịch vụ (`/services`) — 6 cards.
4. Trang giá (`/pricing`) — fetch từ DB.
5. Trang linh kiện (`/parts`) — search + filter.
6. Auth: register + login + middleware.
7. Booking flow (form + API POST).
8. My appointments + tracking.
9. Admin panel.
10. Polish: loading, error, responsive QA.

Dùng `/feature <tên>` để plan từng feature qua agent `fixnow-planner`.
