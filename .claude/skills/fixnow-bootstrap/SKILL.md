---
name: fixnow-bootstrap
description: Bootstrap the FixNow Next.js project from scratch — install Next.js, Tailwind, Drizzle ORM, NextAuth, shadcn/ui, and set up the base folder structure. Use this skill ONCE when starting a fresh project, or to verify all base dependencies are present. Triggers when user says "khởi tạo dự án", "init FixNow", "scaffold project", "setup base".
---

# fixnow-bootstrap

Khởi tạo project FixNow từ con số 0, theo đúng stack đã chốt trong `docs/decisions.md`.

## Trước khi chạy

- Node ≥ 18.17 (`node --version`).
- Postgres ≥ 14 đang chạy (hoặc DATABASE_URL cloud).
- Thư mục trống ngoài: `SPEC.md`, `AGENTS.md`/`CLAUDE.md`, `docs/`, `.claude/`.

Nếu đã có `package.json` → STOP, đừng re-init. Báo user.

## Các bước

### 1. Next.js
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint --use-npm
```

Confirm overwrite docs/CLAUDE.md/AGENTS.md → **NO**.

### 2. Cài deps
```bash
# Auth
npm i next-auth@beta bcryptjs
npm i -D @types/bcryptjs

# Drizzle ORM + pg
npm i drizzle-orm pg @paralleldrive/cuid2 server-only
npm i -D drizzle-kit @types/pg tsx

# Form + validation
npm i react-hook-form zod @hookform/resolvers

# Icons
npm i lucide-react
```

### 3. shadcn/ui
```bash
npx shadcn@latest init
npx shadcn@latest add button input label form card select textarea dialog dropdown-menu table badge toast sheet
```

### 4. Tạo files cần thiết

- `db/schema.ts` (copy từ `docs/database-schema.md`).
- `db/index.ts` (Drizzle client server-only).
- `drizzle.config.ts` ở root.
- `lib/auth.ts` (NextAuth — xem `docs/getting-started.md` Bước 6).
- `lib/validations/booking.ts`, `lib/validations/auth.ts`.
- `lib/labels.ts` (Vietnamese labels cho enums).
- `app/api/auth/[...nextauth]/route.ts`.
- `middleware.ts`.
- `db/seed.ts` (sẽ dùng skill seed-fixtures).

### 5. .env
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/fixnow"
NEXTAUTH_SECRET="<openssl rand -base64 32 hoặc node -e crypto.randomBytes>"
NEXTAUTH_URL="http://localhost:3000"
```

Thêm `.env`, `.env.local` vào `.gitignore`.

### 6. First migration
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 7. Scripts trong package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx db/seed.ts"
  }
}
```

### 8. Verify
```bash
npm run dev
```
Mở http://localhost:3000.

## Checklist hoàn thành

- [ ] `package.json` có Next.js, Drizzle, NextAuth, shadcn deps.
- [ ] `db/schema.ts` khớp `docs/database-schema.md`.
- [ ] Tables đã tạo trong Postgres (verify `npm run db:studio`).
- [ ] `npm run dev` không lỗi.
- [ ] `npx tsc --noEmit` không lỗi.
- [ ] Cập nhật AGENTS.md/CLAUDE.md mục "Trạng thái hiện tại".

## Lỗi thường gặp

- `drizzle-kit generate` báo no schema → check `drizzle.config.ts` path.
- `pg` connect refused → Postgres chưa chạy hoặc DATABASE_URL sai.
- `next-auth@beta` import lỗi → v5 dùng `import NextAuth from 'next-auth'`.
- `shadcn add` fail → cần `components.json` từ `init` trước.
