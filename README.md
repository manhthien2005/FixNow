# FixNow

> Website đặt lịch sửa chữa & bảo trì laptop / PC tận nơi.
> Đồ án sinh viên — minh bạch giá, mobile-first, tiếng Việt.

## 1. Tổng quan

FixNow là kênh **giới thiệu dịch vụ + đặt lịch + tra cứu giá** cho dịch vụ
sửa chữa tận nơi. Mobile-first vì phần lớn khách hàng dùng điện thoại.

**Giá trị cốt lõi**: Tiện lợi — Minh bạch — Nhanh chóng — An toàn dữ liệu.

## 2. Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript strict |
| UI | React 19 Server Components + selective `'use client'` |
| Styling | Tailwind CSS v3 + shadcn/ui (new-york) |
| Database | PostgreSQL (Supabase Session Pooler) |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | NextAuth v5 (Credentials + bcryptjs) |
| Forms | react-hook-form + zod |
| Icons | lucide-react |

Chi tiết lựa chọn + lý do: `docs/decisions.md`.

## 3. Features (MVP)

### Khách hàng (public + auth)
- Trang chủ — hero, 4 giá trị cốt lõi, quy trình 6 bước, CTA
- Dịch vụ — 6 nhóm dịch vụ chính
- Bảng giá dịch vụ — DB-driven, có disclaimer "báo giá trước khi sửa"
- Giá linh kiện — tra cứu RAM / SSD / HDD / pin / phụ kiện, có search + filter loại
- Đặt lịch — form hybrid (guest OK, auth prefill tên + SĐT), validate zod, sinh mã `FN-YYYY-XXXX`
- Xác nhận đặt lịch — hiện mã hẹn + thông tin, CTAs phù hợp guest / auth
- Liên hệ — hotline, Zalo, khu vực phục vụ
- Tra cứu lịch hẹn — guest dùng SĐT + mã, kết quả render server-side
- Đăng ký / Đăng nhập — NextAuth Credentials, hash bcrypt cost 10
- Lịch hẹn của tôi — danh sách + chi tiết, hủy đơn khi trạng thái RECEIVED

### Admin
- Dashboard — 5 stat cards (Tổng + 4 trạng thái) + 5 đơn mới nhất
- Danh sách lịch hẹn — filter status + tìm theo mã/SĐT, paginate 20/trang
- Chi tiết đơn — đổi trạng thái theo state machine:
  - RECEIVED → IN_PROGRESS / CANCELLED
  - IN_PROGRESS → COMPLETED / CANCELLED
  - COMPLETED / CANCELLED → terminal (không revert)

## 4. Cấu trúc thư mục

```
app/
├── (public)/         # Home, services, pricing, parts, booking, contact, track
├── (auth)/           # Login, register (layout riêng — centered card, no navbar)
├── (customer)/       # My-appointments (cần login)
├── admin/            # Admin panel (cần role=ADMIN)
├── api/              # Route handlers
└── actions/          # Server actions (logout)

components/
├── ui/               # shadcn primitives (CLI-generated)
├── layout/           # navbar, footer, floating-contact, nav-links, admin-topbar
└── features/         # booking-form, parts-explorer, admin-status-changer, …

db/
├── schema.ts         # Drizzle schema (4 tables, 4 enums)
├── index.ts          # server-only Pool singleton
└── seed.ts           # Idempotent VN fixture data

lib/
├── auth.ts           # NextAuth full config (bcrypt + DB)
├── labels.ts         # VN labels cho enums
├── utils.ts          # cn, formatAppointmentCode, formatDateVi
├── appointment-status.ts  # State machine cho admin
└── validations/      # zod schemas: auth, booking, admin

drizzle/              # Migrations (committed)
docs/                 # Decisions, schema mirror, routes, conventions, UI system
.claude/              # Skills, agents, slash commands cho Claude Code
```

## 5. Yêu cầu môi trường

- Node.js ≥ 18.17 (khuyến nghị 20 LTS)
- Postgres database (Supabase / Neon / local)
- npm

## 6. Cài đặt local

```bash
git clone <repo-url> fixnow
cd fixnow
npm install
```

Tạo file `.env.local` từ `.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require&uselibpqcompat=true"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="<cùng giá trị NEXTAUTH_SECRET>"
```

**Lưu ý DB**:
- Nếu dùng Supabase free tier → bật Session Pooler (port 5432), KHÔNG dùng
  Transaction Pooler (port 6543) — Drizzle cần prepared statements.
- Tham số `uselibpqcompat=true` để pg client chấp nhận cert Supabase
  (xem `docs/decisions.md` mục 2026-06-08).

Chạy migration + seed:

```bash
npm run db:migrate   # apply schema
npm run db:seed      # tạo demo data (admin + customer + services + parts)
npm run dev          # mở http://localhost:3000
```

## 7. Demo accounts (sau khi seed)

| Role | Login | Mật khẩu |
|------|-------|----------|
| Admin | `admin@fixnow.local` hoặc `0900000001` | `admin123` |
| Customer | `demo@example.com` hoặc `0987654321` | `demo1234` |

Demo data: 9 dịch vụ, 21 linh kiện, 3 lịch hẹn mẫu (`FN-2026-0001..0003`).

## 8. Scripts

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:generate  # Drizzle: tạo migration từ schema
npm run db:migrate   # Drizzle: apply migration
npm run db:studio    # Drizzle Studio (UI xem data)
npm run db:seed      # Reset / refresh demo data (idempotent)
```

## 9. Routes

### Public + customer
| Path | Auth | Mô tả |
|------|------|-------|
| `/` | - | Trang chủ |
| `/services` | - | 6 nhóm dịch vụ |
| `/pricing` | - | Bảng giá dịch vụ |
| `/parts` | - | Tra cứu linh kiện |
| `/contact` | - | Liên hệ |
| `/track` | - | Tra cứu lịch hẹn bằng SĐT + mã |
| `/booking` | guest OK | Đặt lịch |
| `/booking/success` | - | Xác nhận đặt lịch |
| `/login`, `/register` | - | Auth |
| `/my-appointments` | customer | Lịch hẹn của tôi |
| `/my-appointments/[code]` | owner | Chi tiết + hủy |

### Admin
| Path | Auth | Mô tả |
|------|------|-------|
| `/admin` | ADMIN | Dashboard |
| `/admin/appointments` | ADMIN | Danh sách + filter |
| `/admin/appointments/[code]` | ADMIN | Chi tiết + đổi trạng thái |

### API
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | - |
| POST | `/api/auth/[...nextauth]` | - |
| POST | `/api/appointments` | optional |
| GET | `/api/appointments` | ADMIN |
| POST | `/api/appointments/[code]/cancel` | owner |
| PATCH | `/api/appointments/[code]/status` | ADMIN |

## 10. Quy ước

- TypeScript `strict: true`, no `any`
- Server Component mặc định, `'use client'` chỉ khi cần state / event
- Mobile-first Tailwind (base → `sm:` → `md:` → `lg:`)
- UI tiếng Việt có dấu, identifier + comment tiếng Anh
- Commit format Conventional: `feat: ...`, `fix: ...`, `chore: ...`
- Chi tiết: `docs/conventions.md` + `AGENTS.md`

## 11. Bảo mật

- Password hash bcrypt cost 10 trước khi lưu
- `passwordHash` không bao giờ trả về client (columns projection)
- `import 'server-only'` ngăn DB client lọt vào Client Component bundle
- `.env*` gitignored
- Route protection qua `middleware.ts` (admin / customer)
- API admin endpoints check `session.user.role === 'ADMIN'` server-side
- Owner check trên cancel endpoint (không leak existence)

## 12. Sau MVP (không nằm trong phạm vi này)

- Đánh giá / phản hồi sau khi sửa
- Gói bảo trì định kỳ
- Admin CRUD parts / services (hiện chỉ đọc từ seed)
- Lịch sử thay đổi trạng thái (audit log)
- Notification email / SMS / Zalo khi status đổi
- Rate limit cho `/api/auth/register`
