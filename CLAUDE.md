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
- [ ] `package.json` + Next.js scaffold (chạy skill `fixnow-bootstrap`)
- [ ] Drizzle schema + first migration
- [ ] Seed data (services, parts)
- [ ] Layout chung (navbar, footer, floating contact)
- [ ] 6 trang MVP
- [ ] Auth (register, login, middleware)
- [ ] Booking flow (guest + auth)
- [ ] My appointments + tracking
- [ ] Admin panel
- [ ] Responsive QA pass

Khi user hỏi "đang làm tới đâu" → check section này và `git log`.

## Quy tắc khi sửa bộ tooling

1. Không sửa file `components/ui/*` (shadcn CLI-generated).
2. Không sửa upstream skill files trong `.claude/skills/{brainstorming,writing-plans,executing-plans,verification-before-completion,using-superpowers,next-best-practices,vercel-react-best-practices,ui-ux-pro-max}/` — chỉ pull update bằng cách re-fetch.
3. Sửa được: tất cả file trong `.claude/skills/{fixnow-bootstrap,scaffold-page,scaffold-api,db-migrate,seed-fixtures,responsive-qa,shadcn-add}/` (project skills do FixNow tự viết).
4. Mọi quyết định stack mới → thêm entry vào `docs/decisions.md` rồi mới sửa code.
