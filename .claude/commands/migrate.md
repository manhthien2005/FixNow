---
description: Modify Drizzle schema and create a migration safely. Runs the db-migrate skill.
argument-hint: <mo ta thay doi, vd: "them field gender vao users">
---

# /migrate

Sua schema Drizzle va tao migration.

1. Goi skill **db-migrate** voi yeu cau: `$ARGUMENTS`.
2. Doc schema hien tai (db/schema.ts) + docs/database-schema.md.
3. Sua db/schema.ts.
4. Chay `npx drizzle-kit generate`.
5. Doc ky SQL trong drizzle/<latest>.sql truoc khi apply.
6. Chay `npx drizzle-kit migrate`.
7. Cap nhat docs/database-schema.md.

Khi thay doi co rui ro (drop column, rename, breaking, enum value changes) -> spawn agent **fixnow-drizzle-modeler** de review truoc.
