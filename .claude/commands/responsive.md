---
description: Run responsive QA across desktop, tablet, and mobile Chrome viewports.
argument-hint: <route hoac component path>
---

# /responsive

Kiem tra responsive 3 viewport.

1. Goi skill **responsive-qa** voi target: `$ARGUMENTS`.
2. Bao user mo Chrome DevTools va switch qua: 375px (mobile) -> 768px (tablet) -> 1280px (desktop).
3. Chay checklist tung viewport: layout, touch target, tieng Viet, performance, interaction.
4. Output report PASSED/FAILED cho moi viewport + danh sach issue.
5. Neu co loi -> spawn agent **fixnow-ui-builder**.
