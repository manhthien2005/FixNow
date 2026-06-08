---
description: Audit a feature against SPEC.md using the fixnow-spec-reviewer agent.
argument-hint: <ten feature hoac path can review, vd: "trang dat lich" hoac "app/(public)/booking">
---

# /spec-check

Audit code theo SPEC.md.

1. Spawn agent **fixnow-spec-reviewer** voi target: `$ARGUMENTS`.
2. Agent doc SPEC + code + docs roi output report theo dinh dang chuan:
   - CRITICAL: vi pham SPEC hoac bao mat.
   - WARNING: vi pham convention.
   - INFO: goi y cai thien.
   - OK: nhung diem da pass.
3. Trinh bay report cho user, KHONG tu sua. User quyet dinh fix.

Dung lenh nay TRUOC khi commit feature lon hoac tao PR.
