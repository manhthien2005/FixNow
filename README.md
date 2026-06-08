# FixNow

> Website đặt lịch sửa chữa laptop, PC và thiết bị văn phòng tận nơi.
> Tập trung vào trải nghiệm đặt lịch đơn giản, giá minh bạch và quản lý lịch hẹn rõ ràng.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=fff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=fff)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=fff)

## Tổng Quan

FixNow là nền tảng web giúp khách hàng:

1. Xem dịch vụ sửa chữa laptop, PC, máy in và thiết bị văn phòng.
2. Tra cứu bảng giá dịch vụ và linh kiện.
3. Đặt lịch sửa chữa tận nơi.
4. Theo dõi trạng thái lịch hẹn bằng tài khoản hoặc mã lịch hẹn.
5. Liên hệ nhanh qua hotline / Zalo.

Admin có thể quản lý lịch hẹn, cập nhật trạng thái, quản lý bảng giá dịch vụ và linh kiện.

## Tech Stack

| Layer | Stack |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 19, Server Components, shadcn/ui |
| Styling | Tailwind CSS |
| Language | TypeScript strict |
| Database | PostgreSQL |
| ORM | Drizzle ORM + drizzle-kit |
| Auth | NextAuth v5 Credentials + bcryptjs |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Media storage | Optional Supabase Storage |

## Tính Năng Chính

### Khách Hàng

- Landing page giới thiệu FixNow, dịch vụ, quy trình và khu vực phục vụ.
- Trang dịch vụ theo nhóm: laptop, PC, máy in, phần mềm, nâng cấp, hỗ trợ từ xa.
- Bảng giá dịch vụ lấy từ database.
- Trang linh kiện có tìm kiếm và lọc theo loại RAM / SSD / HDD / pin / phụ kiện.
- Đăng ký, đăng nhập bằng số điện thoại hoặc email.
- Đặt lịch sửa chữa với form validate bằng zod.
- Tạo mã lịch hẹn dạng `FN-YYYY-XXXX`.
- Tra cứu lịch hẹn bằng số điện thoại và mã hẹn.
- Xem danh sách lịch hẹn cá nhân.
- Hủy lịch hẹn khi trạng thái còn `RECEIVED`.

### Admin

- Dashboard thống kê lịch hẹn theo trạng thái.
- Danh sách lịch hẹn có tìm kiếm, lọc và phân trang.
- Chi tiết lịch hẹn và cập nhật trạng thái.
- CRUD dịch vụ.
- CRUD linh kiện.
- Upload ảnh dịch vụ / linh kiện nếu cấu hình Supabase Storage.

## Cấu Trúc Repo

```text
FixNow/
├── app/
│   ├── (public)/          # Landing, services, pricing, parts, booking, contact, track
│   ├── (auth)/            # Login, register, forgot password
│   ├── (customer)/        # Account, my appointments
│   ├── admin/             # Admin dashboard and management pages
│   ├── api/               # Route handlers
│   └── actions/           # Server actions
├── components/
│   ├── ui/                # shadcn primitives
│   ├── layout/            # Navbar, footer, floating contact, admin topbar
│   ├── features/          # Domain components
│   └── marketing/         # Landing page helpers
├── db/
│   ├── schema.ts          # Drizzle schema
│   ├── index.ts           # Server-only database client
│   └── seed.ts            # Demo data seed
├── drizzle/               # SQL migrations and Drizzle metadata
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── labels.ts          # Vietnamese enum labels
│   ├── storage.ts         # Optional Supabase Storage helper
│   └── validations/       # zod schemas
├── docs/                  # Project docs
├── public/images/         # UI images and brand assets
└── scripts/               # Utility scripts
```

## Yêu Cầu Môi Trường

- Node.js 20 LTS khuyến nghị.
- npm.
- PostgreSQL database.
- GitHub / Vercel account nếu deploy production.

## Cài Đặt Local

```bash
git clone https://github.com/manhthien2005/FixNow.git
cd FixNow
npm install
```

Tạo `.env.local` từ `.env.example`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"

AUTH_SECRET="generate-a-strong-secret"
NEXTAUTH_SECRET="same-as-auth-secret"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"

# Optional: admin image uploads
NEXT_PUBLIC_SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_STORAGE_BUCKET="fixnow-media"
```

Tạo secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Chạy migration và seed:

```bash
npm run db:migrate
npm run db:seed
```

Chạy local:

```bash
npm run dev
```

Mở `http://localhost:3000`.

## Demo Accounts

Sau khi chạy seed:

| Role | Login | Password |
| --- | --- | --- |
| Admin | `admin@fixnow.local` hoặc `0900000001` | `admin123` |
| Customer | `demo@example.com` hoặc `0987654321` | `demo1234` |

> Khi dùng production thật, đổi thông tin admin mặc định ngay sau khi seed hoặc chỉnh `db/seed.ts` trước khi chạy.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run db:generate  # Generate Drizzle migration
npm run db:migrate   # Apply migration
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed demo data
```

## Kiểm Tra Chất Lượng

Trước khi commit / deploy:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm audit --audit-level=high
```

Responsive baseline:

| Viewport | Size |
| --- | --- |
| Mobile | 375 x 667 |
| Tablet | 768 x 1024 |
| Desktop | 1280 x 800 |

## Routes

### Public

| Path | Description |
| --- | --- |
| `/` | Landing page |
| `/services` | Service groups |
| `/pricing` | Service pricing |
| `/parts` | Parts lookup |
| `/booking` | Booking form |
| `/booking/success` | Booking confirmation |
| `/contact` | Contact and service area |
| `/track` | Track appointment by phone + code |
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Password reset |

### Customer

| Path | Description |
| --- | --- |
| `/account` | Account settings |
| `/my-appointments` | Customer appointments |
| `/my-appointments/[code]` | Appointment detail and cancel action |

### Admin

| Path | Description |
| --- | --- |
| `/admin` | Dashboard |
| `/admin/appointments` | Manage appointments |
| `/admin/appointments/[code]` | Appointment detail and status update |
| `/admin/services` | Manage service prices |
| `/admin/parts` | Manage parts |

## API Overview

| Method | Path | Auth |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/forgot-password` | Public |
| `POST` | `/api/appointments` | Optional |
| `GET` | `/api/appointments` | Admin |
| `GET` | `/api/appointments/me` | Customer |
| `GET` | `/api/appointments/track` | Public |
| `GET` | `/api/appointments/[code]` | Owner / Admin |
| `POST` | `/api/appointments/[code]/cancel` | Owner |
| `PATCH` | `/api/appointments/[code]/status` | Admin |
| `GET` | `/api/services` | Public |
| `GET` | `/api/parts` | Public |
| `PATCH` | `/api/account` | Customer |
| `POST` | `/api/account/password` | Customer |
| `GET/POST` | `/api/admin/services` | Admin |
| `PATCH/DELETE` | `/api/admin/services/[id]` | Admin |
| `GET/POST` | `/api/admin/parts` | Admin |
| `PATCH/DELETE` | `/api/admin/parts/[id]` | Admin |
| `POST` | `/api/admin/upload` | Admin |

## Deploy Lên Vercel

1. Tạo PostgreSQL database và lấy `DATABASE_URL`.
2. Import repo vào Vercel.
3. Framework preset: `Next.js`.
4. Build command: `npm run build`.
5. Thêm Environment Variables:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXTAUTH_SECRET="..."
AUTH_TRUST_HOST="true"
AUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

Optional nếu dùng upload ảnh:

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."
SUPABASE_STORAGE_BUCKET="fixnow-media"
```

6. Chạy migration production database:

```bash
DATABASE_URL="postgresql://..." npm run db:migrate
```

7. Seed dữ liệu demo nếu cần:

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

8. Redeploy project trên Vercel.

## Bảo Mật

- Mật khẩu được hash bằng bcrypt trước khi lưu.
- `passwordHash` không được trả về client.
- Database client được đánh dấu `server-only`.
- Route admin kiểm tra role ở middleware và trong API handler.
- API customer có owner check cho dữ liệu lịch hẹn.
- `.env*` và `.env.local` không được commit.
- Upload ảnh yêu cầu Supabase service role key, chỉ dùng server-side.

## License

No public license. Contact the author before reuse or redistribution.
