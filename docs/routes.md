# Routes Map — FixNow

Next.js App Router. Public routes có header chung, admin có header riêng.

## Public pages (theo SPEC mục 3)

| Path | File | Mô tả | Auth |
|------|------|-------|------|
| `/` | `app/(public)/page.tsx` | Trang chủ | - |
| `/services` | `app/(public)/services/page.tsx` | Dịch vụ — 6 nhóm card | - |
| `/pricing` | `app/(public)/pricing/page.tsx` | Bảng giá dịch vụ | - |
| `/parts` | `app/(public)/parts/page.tsx` | Tra cứu giá linh kiện (search + filter) | - |
| `/booking` | `app/(public)/booking/page.tsx` | Form đặt lịch | guest OK |
| `/contact` | `app/(public)/contact/page.tsx` | Liên hệ + bản đồ | - |
| `/track` | `app/(public)/track/page.tsx` | Tra cứu lịch hẹn bằng SĐT + mã | guest |

## Auth pages

| Path | File | Mô tả |
|------|------|-------|
| `/login` | `app/(auth)/login/page.tsx` | Đăng nhập (SĐT/email + mật khẩu) |
| `/register` | `app/(auth)/register/page.tsx` | Đăng ký |

## Customer pages (cần đăng nhập)

| Path | File | Mô tả |
|------|------|-------|
| `/my-appointments` | `app/(customer)/my-appointments/page.tsx` | Danh sách lịch hẹn của tôi |
| `/my-appointments/[code]` | `app/(customer)/my-appointments/[code]/page.tsx` | Chi tiết lịch hẹn |
| `/account` | `app/(customer)/account/page.tsx` | Thông tin tài khoản |

## Admin pages (cần role=ADMIN)

| Path | File | Mô tả |
|------|------|-------|
| `/admin` | `app/admin/page.tsx` | Dashboard (số liệu nhanh) |
| `/admin/appointments` | `app/admin/appointments/page.tsx` | Danh sách + filter lịch hẹn |
| `/admin/appointments/[code]` | `app/admin/appointments/[code]/page.tsx` | Chi tiết + đổi trạng thái |
| `/admin/parts` | `app/admin/parts/page.tsx` | CRUD linh kiện (sau MVP) |
| `/admin/services` | `app/admin/services/page.tsx` | CRUD dịch vụ (sau MVP) |

## API routes

### Auth

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/auth/register` | Tạo tài khoản khách |
| POST | `/api/auth/[...nextauth]` | NextAuth handler (login/logout/session) |

### Appointments

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/api/appointments` | guest OK | Tạo lịch hẹn mới |
| GET | `/api/appointments/me` | customer | Lịch hẹn của user hiện tại |
| GET | `/api/appointments/track?phone=&code=` | guest | Tra cứu bằng SĐT + mã |
| GET | `/api/appointments` | admin | List + filter (?status=, ?from=, ?to=) |
| GET | `/api/appointments/[code]` | owner/admin | Chi tiết |
| PATCH | `/api/appointments/[code]/status` | admin | Đổi trạng thái |
| POST | `/api/appointments/[code]/cancel` | owner | Hủy (chỉ khi RECEIVED) |

### Catalog (read-only public)

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/services` | List service prices (active) |
| GET | `/api/parts?type=&q=` | Search/filter parts |

## Middleware logic

`middleware.ts` ở root:

```ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      if (pathname.startsWith('/admin')) return token?.role === 'ADMIN';
      if (pathname.startsWith('/my-appointments')) return !!token;
      if (pathname.startsWith('/account')) return !!token;
      return true;
    },
  },
});

export const config = {
  matcher: ['/admin/:path*', '/my-appointments/:path*', '/account/:path*'],
};
```

## Layout structure

```
app/
├── layout.tsx                    # Root: <html>, <body>, providers (NextAuth, Toast)
│
├── (public)/
│   ├── layout.tsx               # Public navbar + footer + floating contact
│   ├── page.tsx                 # Home
│   ├── services/page.tsx
│   ├── pricing/page.tsx
│   ├── parts/page.tsx
│   ├── booking/page.tsx
│   ├── contact/page.tsx
│   └── track/page.tsx
│
├── (auth)/
│   ├── layout.tsx               # Centered card, no navbar
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (customer)/
│   ├── layout.tsx               # Public navbar + customer sidebar/breadcrumb
│   ├── my-appointments/page.tsx
│   └── account/page.tsx
│
├── admin/
│   ├── layout.tsx               # Admin layout: sidebar nav + topbar
│   ├── page.tsx
│   └── appointments/page.tsx
│
└── api/...
```

## Redirect rules

- Chưa login + truy cập `/my-appointments` → `/login?callbackUrl=/my-appointments`
- Chưa login + bấm "Đặt lịch ngay" trong navbar → đi thẳng `/booking` (guest OK).
- Không phải admin + truy cập `/admin/*` → 403 page.
- Đã login + truy cập `/login` hoặc `/register` → `/` (hoặc callbackUrl).
