# Database Schema — FixNow

**Postgres + Drizzle ORM**. Source of truth: `db/schema.ts` (sẽ tạo khi scaffold project).

## Sơ đồ tổng quan

```
User (1) ─────< (N) Appointment
                       │
                       ├── status: enum
                       ├── deviceType: enum
                       └── appointmentCode: unique (FN-YYYY-XXXX)

ServicePrice (independent)
Part (independent, filter by type)
```

## Drizzle schema (target)

File `db/schema.ts`:

```ts
import {
  pgTable, pgEnum, text, varchar, timestamp, boolean, integer,
  index, uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// --- Enums ---
export const roleEnum = pgEnum('role', ['CUSTOMER', 'ADMIN']);
export const deviceTypeEnum = pgEnum('device_type', ['LAPTOP', 'PC', 'PRINTER', 'OTHER']);
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED',
]);
export const partTypeEnum = pgEnum('part_type', ['RAM', 'SSD', 'HDD', 'BATTERY', 'ACCESSORY']);

// --- Tables ---
export const users = pgTable('users', {
  id: varchar('id', { length: 32 }).primaryKey().$defaultFn(() => createId()),
  fullName: text('full_name').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: text('email'),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').notNull().default('CUSTOMER'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  phoneUnique: uniqueIndex('users_phone_unique').on(t.phone),
  emailUnique: uniqueIndex('users_email_unique').on(t.email),
}));

export const appointments = pgTable('appointments', {
  id: varchar('id', { length: 32 }).primaryKey().$defaultFn(() => createId()),
  appointmentCode: varchar('appointment_code', { length: 20 }).notNull(),
  userId: varchar('user_id', { length: 32 })
    .references(() => users.id, { onDelete: 'set null' }),
  customerName: text('customer_name').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address').notNull(),
  deviceType: deviceTypeEnum('device_type').notNull(),
  serviceGroup: text('service_group').notNull(),
  issueDescription: text('issue_description').notNull(),
  preferredTime: timestamp('preferred_time'),
  status: appointmentStatusEnum('status').notNull().default('RECEIVED'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  codeUnique: uniqueIndex('appointments_code_unique').on(t.appointmentCode),
  userIdx:    index('appointments_user_idx').on(t.userId),
  phoneIdx:   index('appointments_phone_idx').on(t.phone),
  statusIdx:  index('appointments_status_idx').on(t.status),
  createdIdx: index('appointments_created_idx').on(t.createdAt),
}));

export const servicePrices = pgTable('service_prices', {
  id: varchar('id', { length: 32 }).primaryKey().$defaultFn(() => createId()),
  serviceName: text('service_name').notNull(),
  priceFrom: text('price_from').notNull(),
  note: text('note'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  nameUnique: uniqueIndex('service_prices_name_unique').on(t.serviceName),
  activeIdx:  index('service_prices_active_idx').on(t.isActive),
}));

export const parts = pgTable('parts', {
  id: varchar('id', { length: 32 }).primaryKey().$defaultFn(() => createId()),
  type: partTypeEnum('type').notNull(),
  name: text('name').notNull(),
  price: text('price').notNull(),
  warranty: text('warranty'),
  note: text('note'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  nameUnique: uniqueIndex('parts_name_unique').on(t.name),
  typeIdx:    index('parts_type_idx').on(t.type),
  activeIdx:  index('parts_active_idx').on(t.isActive),
}));

// --- Relations (cho db.query API) ---
export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, { fields: [appointments.userId], references: [users.id] }),
}));

// --- Inferred types (xài cho zod schemas, server actions, API) ---
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type ServicePrice = typeof servicePrices.$inferSelect;
export type Part = typeof parts.$inferSelect;
```

## drizzle.config.ts

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  strict: true,
  verbose: true,
});
```

## DB client (server-only)

`db/index.ts`:

```ts
import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const globalForDb = globalThis as unknown as { pool?: Pool };
const pool = globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
```

`'server-only'` ngăn DB client bundle vào Client Components.

## Giải thích quyết định

### `userId` nullable trong Appointment
Hỗ trợ **guest booking** (đặt nhanh không cần tài khoản). Khi guest đặt:
- `userId = null`
- `customerName`, `phone`, `address` lấy từ form
- Khách tra cứu lại bằng SĐT + mã hẹn

### `price` lưu text (không Decimal)
- MVP không cần phép tính. Lưu format "Từ 1.500.000đ" trực tiếp đơn giản hơn.
- Khi cần tính → migrate sang `numeric(12,2)` hoặc `bigint` (đơn vị xu).

### `appointmentCode` format `FN-YYYY-XXXX`
- Sequential trong năm hiện tại.
- Logic generate ở API: query `LIKE 'FN-2026-%'` → COUNT + 1 → pad 4 digits.
- Race condition risk: wrap trong `db.transaction(...)` với serialize/select for update nếu cần production-grade.

### Enum thay vì text cho status/deviceType/partType
- Postgres enum type-safe + nhỏ gọn ở storage.
- Drizzle infer enum literal type → autocomplete chuẩn.
- Display label tiếng Việt → map ở `lib/labels.ts`:

```ts
export const APPOINTMENT_STATUS_LABEL = {
  RECEIVED: 'Đã nhận',
  IN_PROGRESS: 'Đang xử lý',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
} as const;
```

### Index
- `phone`, `userId` — để query "lịch hẹn của tôi" và tra cứu guest.
- `status`, `createdAt` — admin filter + sort.
- `type` cho parts — UI filter theo loại linh kiện.

## Migration workflow

```bash
# Sau khi sửa db/schema.ts
npx drizzle-kit generate           # tạo SQL trong drizzle/
# Đọc file SQL, verify
npx drizzle-kit migrate            # apply lên DB

# Drop + recreate cho dev nhanh (KHÔNG dùng nếu có data cần giữ)
# npx drizzle-kit push  # đã đưa vào deny list cho an toàn

# Studio xem data
npx drizzle-kit studio
```

## Seed data

File `db/seed.ts` chạy bằng `npm run db:seed` (`tsx db/seed.ts`).

Tối thiểu:
- 1 admin: `admin@fixnow.local` / `admin123` (chỉ dev).
- 1 customer demo: phone `0987654321` / `demo1234`.
- ≥ 8 services theo SPEC mục 4.4.
- ≥ 16 parts (4-5 mỗi loại).
- 2-3 sample appointments (1 của customer, 1 guest).

Quy tắc: dùng `onConflictDoNothing` hoặc `onConflictDoUpdate` để rerun idempotent. Hash password bằng bcrypt trước khi insert.

## ENV vars cần có

```env
# .env (không commit)
DATABASE_URL="postgresql://postgres:password@localhost:5432/fixnow"

NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

## Query patterns (rút gọn)

```ts
import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users, appointments } from '@/db/schema';

// SELECT explicit columns (không trả passwordHash)
const me = await db.query.users.findFirst({
  where: eq(users.id, userId),
  columns: { id: true, fullName: true, phone: true, email: true, role: true },
});

// List với filter + pagination
const list = await db.query.appointments.findMany({
  where: eq(appointments.userId, userId),
  orderBy: [desc(appointments.createdAt)],
  limit: 20,
});

// Multi-step write → transaction
await db.transaction(async (tx) => {
  const [appt] = await tx.insert(appointments).values({ /* ... */ }).returning();
  // có thể update bảng khác cùng tx
});
```
