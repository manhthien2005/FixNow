# CLAUDE.md — FixNow

Project rules live in `AGENTS.md`. Read it first.

@AGENTS.md
@SPEC.md

## Claude-Code-specific tips

- Skills live in `.claude/skills/` (custom + upstream). Agents in `.claude/agents/`. Slash commands in `.claude/commands/`. Settings in `.claude/settings.json`.
- For non-trivial features start with `/feature <name>` — it spawns the `fixnow-planner` agent (opus) to produce a build plan referencing SPEC.
- For UI: spawn `fixnow-ui-builder`. For API: `fixnow-api-builder`. For schema: `fixnow-drizzle-modeler`. For audit: `fixnow-spec-reviewer`.
- For frontend QA: `/responsive <target>` runs the desktop/tablet/mobile Chrome checklist.
- When schema changes are needed: `/migrate <description>` → inspect SQL → apply.
- When the user adds a new external skill: put it under `.claude/skills/<skill-name>/` and add a one-line entry under "Available skills" in `AGENTS.md`. Do NOT clone the full source repo into the project tree.

## Workflow-level skills available (from obra/superpowers)

Use these for any non-trivial work:
- `brainstorming` before designing.
- `writing-plans` once design is approved.
- `executing-plans` while implementing.
- `verification-before-completion` before reporting "done".

## Trạng thái hiện tại (build progress)

- [x] SPEC.md có
- [x] Tooling: skills + agents + commands + AGENTS.md
- [x] Stack chốt: Next.js + Postgres + Drizzle + NextAuth + shadcn
- [x] `package.json` + Next.js scaffold (Next 15 + React 19 + TS strict + Tailwind v3)
- [x] Drizzle schema + first migration (`drizzle/0000_great_gertrude_yorkes.sql` applied to Supabase Session Pooler)
- [x] shadcn/ui base components (13 primitives in `components/ui/`)
- [x] NextAuth v5 foundation (split config: `auth.config.ts` Edge-safe + `lib/auth.ts` bcrypt+DB authorize)
- [x] Zod validations + VN label maps (`lib/validations/`, `lib/labels.ts`)
- [x] Seed data: 2 users, 9 services, 21 parts (4-5 mỗi loại), 3 sample appointments — idempotent via onConflictDoNothing
- [x] Layout chung (navbar sticky + DropdownMenu auth-aware, footer 3 cột, floating Zalo+hotline mobile-only, app/(public)/layout.tsx)
- [x] 6 trang MVP: home, services, pricing, parts, booking, contact ✓ (+ /track guest tra cứu)
- [x] Auth pages (login, register) + POST /api/auth/register (bcrypt, unique check, normalize email)
- [ ] Booking flow (form → POST → appointment code)
- [x] My appointments + detail + cancel button (POST /api/appointments/[code]/cancel)
- [x] Admin panel: /admin dashboard (5 stat cards + recent), /admin/appointments (filter + paginate), detail + status changer (state-machine RECEIVED → IN_PROGRESS → COMPLETED with CANCELLED escape). GET + PATCH /api/appointments. Topbar layout với role badge.
- [ ] Responsive QA pass

**DB connection notes (Supabase):**
- Direct connection (port 5432, `db.<ref>.supabase.co`) → IPv6-only, won't work on most Vietnamese dev networks.
- ✅ Use **Session Pooler** (port 5432, `aws-X-<region>.pooler.supabase.com`) — IPv4 + supports prepared statements (Drizzle needs this).
- ❌ Don't use Transaction Pooler (port 6543) — breaks Drizzle prepared statements.
- URL must include `?sslmode=require&uselibpqcompat=true` — newer `pg` treats `sslmode=require` as `verify-full` by default, which rejects Supabase pooler certs.

Khi user hỏi "đang làm tới đâu" → check section này và `git log`.

## Quy tắc khi sửa bộ tooling

1. Không sửa file `components/ui/*` (shadcn CLI-generated).
2. Không sửa upstream skill files trong `.claude/skills/{brainstorming,writing-plans,executing-plans,verification-before-completion,using-superpowers,next-best-practices,vercel-react-best-practices,ui-ux-pro-max}/` — chỉ pull update bằng cách re-fetch.
3. Sửa được: tất cả file trong `.claude/skills/{fixnow-bootstrap,scaffold-page,scaffold-api,db-migrate,seed-fixtures,responsive-qa,shadcn-add}/` (project skills do FixNow tự viết).
4. Mọi quyết định stack mới → thêm entry vào `docs/decisions.md` rồi mới sửa code.
