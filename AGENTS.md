# AGENTS.md — FixNow

Multi-tool canonical project rules. Read by Claude Code, Cursor, Codex, Cline, Copilot, and similar agents. Claude-Code-specific notes live in `CLAUDE.md`. SPEC lives in `SPEC.md`.

---

## 1. Project

FixNow — website đặt lịch sửa chữa laptop/PC tận nơi (đồ án sinh viên). Mobile-first, tiếng Việt UI, có auth + database + admin panel.

Full requirements: `SPEC.md`.

## 2. Stack (locked — không đổi mà chưa update `docs/decisions.md`)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ App Router |
| Language | TypeScript strict |
| UI | React Server Components + selective `'use client'` |
| Styling | Tailwind CSS + shadcn/ui (UI source of truth) |
| Database | PostgreSQL |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | NextAuth v5 (Credentials + bcryptjs) |
| Forms | react-hook-form + zod |
| Icons | lucide-react |

**Do NOT add** Redis, TanStack Virtual, tRPC, Prisma, Tailwind plugins beyond `@tailwindcss/forms` unless a feature actually requires it. Log the decision in `docs/decisions.md` first.

## 3. Folder structure (canonical)

```
.
├── app/                 # Next.js App Router
│   ├── (public)/
│   ├── (auth)/
│   ├── (customer)/
│   ├── admin/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/              # shadcn primitives (CLI-generated, do NOT edit)
│   ├── layout/          # navbar, footer, floating-contact
│   └── features/        # domain components
├── db/
│   ├── index.ts         # server-only Drizzle client singleton
│   ├── schema.ts        # source of truth for schema
│   └── seed.ts
├── drizzle/             # drizzle-kit migrations (committed, do NOT edit)
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── labels.ts        # VN labels for enums
│   ├── validations/     # zod schemas (client + server)
│   └── utils.ts
├── docs/
├── drizzle.config.ts
├── middleware.ts
├── .env                 # never commit, never Read with the Read tool
└── .claude/
```

## 4. Core rules

### TypeScript
- `strict: true`. No `any` (use `unknown` + narrow).
- Avoid `as` casts. Prefer type guards.
- Drizzle types: `type User = typeof users.$inferSelect; type NewUser = typeof users.$inferInsert`.

### React / Next.js
- Server Component is the default. Add `'use client'` only when you need state, effects, event handlers, browser APIs, or `next/navigation` hooks.
- Push `'use client'` down to leaf components. Keep data fetching in Server Components / Server Actions / Route Handlers.
- Use `next/image` and `next/font` (Vietnamese subset for Inter).
- Use `error.tsx`, `loading.tsx`, and Suspense boundaries.
- Next.js 15+: `params` and `searchParams` are Promises — `await` them.
- For deep guidance see skill `next-best-practices` (`.claude/skills/next-best-practices/`).
- For rendering/rerender/server perf rules see skill `vercel-react-best-practices`.

### Tailwind + shadcn/ui
- Mobile-first: base classes first, then `sm:`/`md:`/`lg:` (e.g. `p-4 md:p-6 lg:p-8`).
- Use design tokens from `docs/ui-system.md`. **No hard-coded hex colors.**
- Add shadcn components via `npx shadcn@latest add <name>` — never copy from the upstream repo by hand. See skill `shadcn-add`.
- Do NOT edit `components/ui/*.tsx` directly. Wrap in `components/features/` instead.

### Database / Drizzle / PostgreSQL
- `db/index.ts` has `import 'server-only'` — DB client never enters the client bundle.
- All queries go through the singleton `db` from `@/db`.
- Always project fields with `columns: { ... }`. **Never return `passwordHash` to the client.**
- Multi-step writes must use `db.transaction(async (tx) => { ... })`.
- Migrations: `npx drizzle-kit generate` → inspect SQL → `npx drizzle-kit migrate`. Never use `drizzle-kit push` against data you care about (denied by default in settings).
- Source of truth: `db/schema.ts`. Documentation mirror: `docs/database-schema.md`.

### Validation (zod)
- All user input (form, API body, query params, dynamic route params) must pass a zod schema before use.
- Schemas live in `lib/validations/<feature>.ts` and are shared by client (react-hook-form) and server (route handler / Server Action).
- Vietnamese error messages.

### Auth & security
- Sessions via NextAuth v5 (`lib/auth.ts`).
- Passwords: bcrypt cost ≥ 10 before insert. Never log or return.
- Route protection via `middleware.ts` for `/admin`, `/my-appointments`, `/account`.
- Role check inside admin route handlers: `session?.user?.role === 'ADMIN'`.
- Never Read `.env*` (denied in settings).

### API routes
- Pattern: `try { auth → zod parse → DB → NextResponse.json }`.
- Always `try/catch`.
- Status codes: 200 / 201 / 204 / 400 / 401 / 403 / 404 / 500. No raw `Error` to client.
- Log errors with `[METHOD /api/path]` prefix.
- See `docs/routes.md` for the full endpoint matrix.

### Responsive UI — mandatory for every frontend change
Check all three Chrome viewports before reporting "done":

| Viewport | Width × Height | Notes |
|----------|---------------|-------|
| Mobile   | 375 × 667     | iPhone SE baseline. No horizontal scroll. Touch target ≥ 44px. Input `text-base` (16px) to avoid iOS zoom. |
| Tablet   | 768 × 1024    | Grid 1 → 2 col. Navbar inline links visible. |
| Desktop  | 1280 × 800    | Grid 2 → 3 → 4 col where useful. Floating mobile contact hidden (`md:hidden`). |

Use the `responsive-qa` skill or `/responsive` command for the full checklist.

### Vietnamese
- All user-facing text: Vietnamese with diacritics, UTF-8.
- Identifiers (variables, functions, classes): English.
- Comments and commit messages: English. Commit format `feat: ...` / `fix: ...` / `refactor: ...`.

## 5. Available skills (`.claude/skills/`)

### Project skills (custom, FixNow-specific)
- `fixnow-bootstrap` — init Next.js + Drizzle + shadcn from scratch.
- `scaffold-page` — create a Next.js page with proper route group + loading + error.
- `scaffold-api` — create a `route.ts` with zod + auth + Drizzle pattern.
- `db-migrate` — safely modify schema + run drizzle-kit.
- `seed-fixtures` — maintain `db/seed.ts` with Vietnamese demo data.
- `responsive-qa` — desktop / tablet / mobile Chrome QA checklist.
- `shadcn-add` — add shadcn components the right way.

### Workflow skills (from obra/superpowers)
- `brainstorming` — explore intent before designing.
- `writing-plans` — turn a design into an actionable plan.
- `executing-plans` — disciplined plan execution.
- `verification-before-completion` — pre-"done" QA gate.
- `using-superpowers` — meta-skill for the workflow.

### Reference skills (from Vercel + ui-ux-pro-max)
- `next-best-practices` — file-conventions, RSC boundaries, data, async, error handling, route handlers, metadata, image, font, bundling, suspense, parallel routes.
- `vercel-react-best-practices` — ~70 rule files on rendering, rerender, server, async, bundle.
- `ui-ux-pro-max` — design intelligence (SKILL.md only; full Python lookup NOT installed — see `.claude/skills/ui-ux-pro-max/PROJECT-NOTE.md`).

## 6. Available agents (`.claude/agents/`)

| Agent | When to spawn |
|-------|---------------|
| `fixnow-planner` | Break a non-trivial feature into a build plan. |
| `fixnow-ui-builder` | Build / modify mobile-first UI with shadcn. |
| `fixnow-api-builder` | Build / modify route handlers (zod + auth + Drizzle). |
| `fixnow-drizzle-modeler` | Schema design, migrations, seed strategy. |
| `fixnow-spec-reviewer` | Read-only audit of a feature against SPEC. |

## 7. Slash commands (`.claude/commands/`)

| Command | Purpose |
|---------|---------|
| `/feature <name>` | Spawn planner to break down a new feature. |
| `/page <route>` | Scaffold a Next.js page. |
| `/api <method> <path>` | Scaffold a route handler. |
| `/migrate <change>` | Drizzle schema change + migration. |
| `/seed` | Refresh `db/seed.ts`. |
| `/responsive <target>` | Run desktop / tablet / mobile QA. |
| `/spec-check <feature>` | Audit feature against SPEC. |
| `/status` | Show MVP progress. |

## 8. Working agreements

1. **Inspect before changing.** Read the file (and related docs) before edits.
2. **Plan before non-trivial work.** Use `/feature` or the brainstorming / writing-plans skills.
3. **Don't change locked decisions** without an entry in `docs/decisions.md`.
4. **Verify before saying done.** TypeScript pass, lint pass, responsive checked across 3 viewports, no console errors.
5. **Confirm risky actions.** Schema drops, force pushes, env reads, mass deletes — ask first.
6. **No new MD docs** outside the catalog above unless the user asks for one.
7. **Don't clone external repos** for skill/library content. Use `npx shadcn add` or project-scoped skill copies in `.claude/skills/`.

## 9. Quick reference

- Stack source of truth: this file + `docs/decisions.md`.
- Database source of truth: `db/schema.ts` (mirror: `docs/database-schema.md`).
- API source of truth: `docs/routes.md` + actual `app/api/**/route.ts`.
- UI design tokens: `docs/ui-system.md`.
- Onboarding: `docs/getting-started.md`.
- Current build progress: `/status` command or "Trạng thái hiện tại" in `CLAUDE.md`.
