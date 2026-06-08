---
description: Scaffold a new Next.js page for FixNow. Runs the scaffold-page skill with the provided route path.
argument-hint: <route, vd: /services hoac /admin/appointments>
---

# /page

Tao trang Next.js moi theo pattern FixNow.

1. Goi skill **scaffold-page** voi route: `$ARGUMENTS`.
2. Hoi user neu thieu thong tin (route group, auth, data needs).
3. Tao page.tsx + loading.tsx + error.tsx neu can.
4. Cap nhat docs/routes.md.

Khi feature phuc tap (nhieu component, can interactive) -> spawn agent **fixnow-ui-builder**.
