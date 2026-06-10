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

## 2026-06-08 — Database host: Supabase

### Stack
- **DB host**: Supabase Postgres (project `wjgdwflbofwtxzwvlsnz`, region Tokyo `ap-northeast-1`).
- **Connection mode**: Session Pooler (port 5432, host `aws-X-<region>.pooler.supabase.com`).
- **Why pooler not direct**: Supabase Direct Connection only exposes IPv6 on free tier — Vietnamese consumer ISPs typically only have IPv4 → `ECONNABORTED`. Session Pooler is IPv4 + supports prepared statements (Drizzle requires them).
- **Why Session not Transaction pooler**: Transaction Pooler (port 6543) disables prepared statements → Drizzle queries fail.
- **SSL**: must use `?sslmode=require&uselibpqcompat=true`. Recent `pg` versions treat plain `sslmode=require` as `verify-full` which rejects Supabase pooler certs.
- **Trade-off / risk**: free tier pauses project after 7 days inactive (click "Restore" in dashboard to wake). 500MB DB / 2GB egress monthly — plenty for demo.
- **Reversible?**: yes — schema is portable, change `DATABASE_URL` to migrate to Neon / local Postgres without code change.

## 2026-06-10 — Chatbot hỗ trợ khách hàng (Gemini)

### AI chatbot stack
- **Quyết định**: thêm `ai` (Vercel AI SDK v5) + `@ai-sdk/google` + `@ai-sdk/react` cho chatbot CSKH; model mặc định `gemini-3.1-flash-lite` (Google AI Studio free tier ~30 RPM / 1.500 req/ngày / 1M TPM — cao nhất hiện tại), đổi được qua env `CHATBOT_MODEL`.
- **Lý do**: streaming UI mượt qua `useChat` + `streamText` thay vì tự parse SSE (~200 dòng client code dễ lỗi); provider-agnostic (đổi model = 1 dòng); 3.1-flash-lite GA từ 7/5/2026, quota free cao nhất → tránh rate limit khi demo (Pro không còn free từ 4/2026).
- **Grounding**: context-stuffing (catalog ~9 dịch vụ + ~21 linh kiện) qua `unstable_cache` dùng chung tags `service-prices` / `parts` với trang pricing/parts — KHÔNG cần RAG / vector DB. Admin sửa giá → revalidateTag đã có → bot tự cập nhật.
- **Rate limit**: in-memory per-IP (10 req/phút) — đủ cho single-instance demo, không dùng Redis (theo stack rule). Trade-off: reset khi redeploy, không share giữa nhiều instance.
- **Trade-off / rủi ro**: phụ thuộc quota free của Google; khi hết quota chatbot trả fallback kèm hotline (web không crash).
- **Reversible?**: yes — đổi provider/model chỉ cần sửa env + 1 dòng code.
