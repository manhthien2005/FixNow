# Coding Conventions — FixNow

## TypeScript

- `strict: true` trong tsconfig. Không dùng `any` — nếu thật cần thì `unknown` rồi narrow.
- Tránh `as` casting trừ khi cần. Prefer type guards.
- Export `type` cho data shapes, `interface` cho object contracts với class/extends.
- Dùng `type X = typeof xs.$inferSelect` để lấy type từ Drizzle table (không viết tay).

## React / Next.js

### Server vs Client Components

```tsx
// Server Component (default) — không cần directive
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { servicePrices } from '@/db/schema';

export default async function ServicesPage() {
  const services = await db.query.servicePrices.findMany({
    where: eq(servicePrices.isActive, true),
  });
  return <ServiceList items={services} />;
}

// Client Component — chỉ khi cần
'use client';
import { useState } from 'react';
export function BookingForm() { /* ... */ }
```

**Quy tắc**:
- Mặc định Server Component.
- Chỉ `'use client'` khi cần: `useState`, `useEffect`, event handlers, browser APIs, `next/navigation` hooks.
- Đẩy `'use client'` xuống càng sâu càng tốt (leaf components).
- Data fetching: **luôn ở Server Component / Server Action / Route Handler**, pass xuống Client qua props.
- DB import (`@/db`) là **server-only** — sẽ throw nếu lỡ import vào Client Component.

### File naming

| Loại | Convention | Ví dụ |
|------|------------|-------|
| Page | `page.tsx` | `app/services/page.tsx` |
| Layout | `layout.tsx` | `app/(public)/layout.tsx` |
| Loading | `loading.tsx` | `app/services/loading.tsx` |
| API route | `route.ts` | `app/api/appointments/route.ts` |
| Component | kebab-case `.tsx` | `booking-form.tsx` |
| Hook | `use-*.ts` | `use-booking.ts` |
| Util | kebab-case `.ts` | `format-currency.ts` |
| Type | kebab-case `.ts` | `appointment-types.ts` |

### Component pattern

```tsx
// components/features/booking-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, type BookingInput } from '@/lib/validations/booking';

interface BookingFormProps {
  defaultValues?: Partial<BookingInput>;
  onSuccess?: (code: string) => void;
}

export function BookingForm({ defaultValues, onSuccess }: BookingFormProps) {
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });
  // ...
}
```

## API Routes

Mẫu chuẩn:

```ts
// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { appointments } from '@/db/schema';
import { bookingSchema } from '@/lib/validations/booking';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    const code = await generateAppointmentCode();
    const [row] = await db.insert(appointments).values({
      ...data,
      appointmentCode: code,
      status: 'RECEIVED',
    }).returning();

    return NextResponse.json({ appointment: row }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.flatten() },
        { status: 400 }
      );
    }
    console.error('[POST /api/appointments]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

**Quy tắc**:
- Luôn `try/catch`.
- Validate input bằng zod **trước** khi dùng.
- Trả về `NextResponse.json()` với status code đúng (200/201/400/401/403/404/500).
- Log error với prefix `[METHOD /api/path]`.
- KHÔNG trả raw Error object (lộ stack trace).

## Database (Drizzle ORM)

- Tất cả query qua singleton `db` từ `db/index.ts` (file có `import 'server-only'`).
- Dùng `columns: { ... }` để chỉ lấy field cần — KHÔNG bao giờ trả `passwordHash` về client.
- Multi-step writes phải dùng `db.transaction(async (tx) => { ... })`.
- Pagination: `limit` + `offset` cho UI có trang số; cursor (`gt`/`lt` trên `createdAt` hoặc `id`) cho infinite scroll.
- Index những field hay query: `phone`, `userId`, `status`, `createdAt`. Tham khảo `docs/database-schema.md`.

```ts
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { users, appointments } from '@/db/schema';

// Tốt
const user = await db.query.users.findFirst({
  where: eq(users.phone, phone),
  columns: { id: true, fullName: true, phone: true, role: true },
});

// Tránh — không có columns -> include passwordHash
const user = await db.query.users.findFirst({ where: eq(users.phone, phone) });

// List + sort + pagination
const list = await db.query.appointments.findMany({
  where: eq(appointments.userId, userId),
  orderBy: [desc(appointments.createdAt)],
  limit: 20,
  offset: page * 20,
});

// Transaction
await db.transaction(async (tx) => {
  const [appt] = await tx.insert(appointments).values({ /* ... */ }).returning();
  // multiple writes here
});
```

## Validation (zod)

Tất cả schemas đặt trong `lib/validations/`. Cùng schema dùng cho cả client (react-hook-form) và server (route handler / Server Action).

```ts
// lib/validations/booking.ts
import { z } from 'zod';

export const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

export const bookingSchema = z.object({
  customerName: z.string().min(2, 'Họ tên ít nhất 2 ký tự').max(100),
  phone: z.string().regex(phoneRegex, 'SĐT không hợp lệ'),
  address: z.string().min(5, 'Địa chỉ không hợp lệ').max(255),
  deviceType: z.enum(['LAPTOP', 'PC', 'PRINTER', 'OTHER']),
  serviceGroup: z.string().min(1),
  issueDescription: z.string().min(10, 'Mô tả ít nhất 10 ký tự').max(2000),
  preferredTime: z.string().datetime().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
```

## Styling (Tailwind + shadcn/ui)

- **Mobile-first**: viết base class trước, breakpoint sau (`p-4 md:p-6 lg:p-8`).
- **Container**: `container mx-auto px-4` cho wrapper.
- **Spacing scale**: ưu tiên `4, 6, 8, 12, 16` (Tailwind units).
- **Colors**: chỉ dùng tokens trong @docs/ui-system.md, không hard-code hex.
- **Component composition**: shadcn `<Button>`, `<Input>`, `<Card>` — không tự viết lại nếu đã có.

## Error handling (UI)

- Form errors: hiển thị dưới input bằng `<FormMessage>` của shadcn.
- Page errors: dùng `error.tsx` của Next.js App Router.
- Loading: dùng `loading.tsx` hoặc Suspense boundary.
- Toast: shadcn `useToast`.

## Tiếng Việt trong code

- Text user thấy (button label, message, error) → tiếng Việt có dấu, UTF-8.
- Identifier (variable, function, class) → tiếng Anh.
- Commit message → tiếng Anh ngắn gọn (`feat: add booking form`).
- Comment trong code → tiếng Anh trừ khi giải thích domain VN (vd: format SĐT).

## Imports

Thứ tự:
1. React / Next.js
2. Third-party packages
3. `@/db`, `@/lib/*`, `@/components/*` (alias từ `tsconfig.json`)
4. Relative imports
5. Type-only imports cuối cùng với `import type`

```ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { BookingForm } from '@/components/features/booking-form';
import { formatPhone } from './utils';
import type { Appointment } from '@/db/schema';
```

## Git commits

- Format: `<type>: <description>` (tiếng Anh).
- Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`.
- Ví dụ:
  - `feat: add booking form with phone validation`
  - `fix: prevent duplicate appointment code generation`
  - `refactor: extract booking logic to use-booking hook`
