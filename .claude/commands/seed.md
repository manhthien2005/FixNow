---
description: Refresh or extend db/seed.ts with FixNow demo data.
---

# /seed

Quan ly seed data.

1. Goi skill **seed-fixtures**.
2. Hoi user: them moi hay refresh data?
3. Sua db/seed.ts theo template (idempotent voi onConflictDoNothing, hash password bcrypt).
4. Chay npm run db:seed.
5. Verify bang npx drizzle-kit studio.
