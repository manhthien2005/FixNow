# Decisions Log — FixNow

Ghi lại các quyết định kiến trúc/design đã chốt. **Không sửa khi đã chốt** — nếu cần đổi → thêm entry mới với lý do.

## 2026-06-07 — Khởi tạo dự án

### Stack chính
- **Frontend + Backend**: Next.js 14+ App Router + TypeScript.
  - Lý do: full-stack trong 1 codebase, routing tự động, dễ deploy Vercel, phù hợp đồ án.
- **Database**: PostgreSQL.
  - Lý do: user chọn vì mạnh mẽ, chuẩn RDBMS, dễ scale.
- **ORM**: Drizzle ORM (đổi từ Prisma sau khi user yêu cầu).
  - Lý do: TypeScript-first (schema = code, types tự suy), output bundle nhẹ, không cần codegen riêng, query builder gần SQL hơn nên dễ hiểu trade-off. drizzle-kit generate + migrate đủ cho dự án MVP.
  - Trade-off: Drizzle non-prescriptive hơn Prisma (ít magic). Cần kỷ luật về schema modeling. Rename column phải sửa migration SQL tay.
- **Auth**: NextAuth.js v5 (Auth.js) với Credentials Provider.
  - Lý do: tích hợp Next.js tốt, không cần OAuth external (đồ án không cần Google login).
- **Styling**: Tailwind CSS + shadcn/ui.
  - Lý do: mobile-first dễ, component có sẵn đẹp, copy-paste vào project (không lock vendor).
- **Form**: react-hook-form + zod.
  - Lý do: zod schema dùng được cả client validate + server validate.

### Scope
- **Admin panel**: làm cùng MVP. Bao gồm danh sách lịch hẹn, đổi trạng thái, dashboard cơ bản.
- **Booking flow**: hybrid — cho guest đặt nhanh, đồng thời có tài khoản để xem lịch sử.
  - Customer name + phone + address là bắt buộc cho mọi booking.
  - User login chỉ có lợi: auto-fill form + xem "Lịch hẹn của tôi".

### Conventions
- **UI tiếng Việt**, code/comment tiếng Anh.
- **Mobile-first**: viết base class trước, breakpoint sau.
- **Server Component mặc định**, chỉ `'use client'` khi cần.

### Schema decisions
- `appointments.userId` nullable → support guest booking.
- `price` lưu text → MVP không cần tính toán, dễ format VND.
- Postgres `pgEnum` cho `role`, `device_type`, `appointment_status`, `part_type` → type-safe + storage gọn.
- `appointmentCode` format `FN-YYYY-XXXX` → dễ đọc cho khách.

## 2026-06-08 — Skill workflow setup

### Skill sources được cài (project-scoped, không clone repo gốc)
- `obra/superpowers` → 5 skills: `brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion`, `using-superpowers`.
- `nextlevelbuilder/ui-ux-pro-max-skill` → chỉ `SKILL.md` (Python lookup tools không cài; xem `.claude/skills/ui-ux-pro-max/PROJECT-NOTE.md`).
- `vercel-labs/next-skills` → `next-best-practices` (SKILL.md + 19 references).
- `vercel-labs/agent-skills` → `vercel-react-best-practices` (SKILL.md + AGENTS.md + 72 rule files).
- `shadcn-ui/ui` → KHÔNG clone. Custom skill `shadcn-add` documenting `npx shadcn add` workflow.

### Lý do chỉ cài minimal
- Project nhỏ + đồ án sinh viên: không cần TDD, parallel agents, git-worktrees từ superpowers.
- Bỏ Python search trong ui-ux-pro-max để tránh dependency runtime Python.
- shadcn nguồn = lệnh CLI chính thức, không paste source.

### Responsive scope mở rộng
- Đổi từ "mobile-only QA" sang "responsive QA cho desktop + tablet + mobile Chrome" theo user requirement.

### Naming
- Tên project: **FixNow**.
- Domain giả định: `fixnow.local` (dev), `fixnow.vn` (production tham khảo).
- Branding: tông xanh dương (`#2563EB`) — gợi cảm giác tin cậy + công nghệ.

---

## Để thêm decision mới

Format:

```
## YYYY-MM-DD — <Tiêu đề ngắn>

### <Topic>
- **Quyết định**: ...
- **Lý do**: ...
- **Trade-off / rủi ro**: ...
- **Reversible?**: yes/no — nếu no thì giải thích.
```
