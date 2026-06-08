---
description: Plan and break down a feature for FixNow before implementation. Spawns the fixnow-planner agent to produce a structured build plan referencing SPEC.md.
argument-hint: <ten feature, vd: "dat lich" hoac "trang gia linh kien">
---

# /feature

Plan mot feature truoc khi code, dam bao theo dung SPEC.

## Workflow

1. Doc SPEC.md va decisions.md.
2. Spawn agent **fixnow-planner** voi yeu cau:
   - Map feature: `$ARGUMENTS` vao SPEC muc nao.
   - Liet ke schema changes, API endpoints, pages, components.
   - Output theo format chuan cua planner.
3. Trinh bay plan cho user, hoi cau hoi neu co.
4. Sau khi user duyet -> bat dau implement theo thu tu (schema -> API -> page -> component).

## Khong tu y code

Command nay chi PLAN. KHONG implement truc tiep. User se ra lenh tiep theo sau khi review plan.
