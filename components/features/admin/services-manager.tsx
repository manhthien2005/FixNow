"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/features/admin/image-upload";
import { resolveServiceImage } from "@/lib/images";
import type { ServicePrice } from "@/db/schema";

type FormState = {
  serviceName: string;
  priceFrom: string;
  note: string;
  imagePath: string | null;
  isActive: boolean;
  sortOrder: number;
};

const emptyForm: FormState = {
  serviceName: "",
  priceFrom: "",
  note: "",
  imagePath: null,
  isActive: true,
  sortOrder: 0,
};

function toForm(s: ServicePrice): FormState {
  return {
    serviceName: s.serviceName,
    priceFrom: s.priceFrom,
    note: s.note ?? "",
    imagePath: s.imagePath ?? null,
    isActive: s.isActive,
    sortOrder: s.sortOrder,
  };
}

export function ServicesManager({
  initialServices,
}: {
  initialServices: ServicePrice[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServicePrice | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setOpen(true);
  }
  function openEdit(s: ServicePrice) {
    setEditing(s);
    setForm(toForm(s));
    setError(null);
    setOpen(true);
  }

  async function handleSave() {
    setError(null);
    if (form.serviceName.trim().length < 2 || form.priceFrom.trim().length < 1) {
      setError("Vui lòng nhập tên dịch vụ (≥2 ký tự) và giá.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        serviceName: form.serviceName.trim(),
        priceFrom: form.priceFrom.trim(),
        note: form.note.trim() || null,
        imagePath: form.imagePath,
        isActive: form.isActive,
        sortOrder: form.sortOrder,
      };
      const res = await fetch(
        editing ? `/api/admin/services/${editing.id}` : "/api/admin/services",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(data.message ?? "Lưu thất bại. Kiểm tra lại dữ liệu.");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Lỗi mạng khi lưu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(s: ServicePrice) {
    if (!confirm(`Xóa dịch vụ "${s.serviceName}"?`)) return;
    setDeletingId(s.id);
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {initialServices.length} dịch vụ
        </p>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Thêm dịch vụ
        </Button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {initialServices.map((s) => (
          <div key={s.id} className="flex gap-3 rounded-xl border bg-card p-3">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={resolveServiceImage(s.imagePath)}
                alt={s.serviceName}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold leading-snug">
                  {s.serviceName}
                </p>
                {!s.isActive ? (
                  <span className="shrink-0 rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                    Ẩn
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm font-bold text-primary">
                {s.priceFrom}
              </p>
              {s.note ? (
                <p className="truncate text-xs text-muted-foreground">
                  {s.note}
                </p>
              ) : null}
              <div className="mt-2 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onClick={() => openEdit(s)}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(s)}
                  disabled={deletingId === s.id}
                >
                  {deletingId === s.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Sửa dịch vụ" : "Thêm dịch vụ"}
            </DialogTitle>
            <DialogDescription>
              Thông tin hiển thị trên trang bảng giá dịch vụ.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <ImageUpload
              folder="services"
              value={form.imagePath}
              onChange={(path) => setForm((f) => ({ ...f, imagePath: path }))}
              fallbackSrc={resolveServiceImage(null)}
            />

            <div className="space-y-1.5">
              <Label htmlFor="svc-name">Tên dịch vụ</Label>
              <Input
                id="svc-name"
                value={form.serviceName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, serviceName: e.target.value }))
                }
                placeholder="Vệ sinh laptop / PC + tra keo tản nhiệt"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="svc-price">Giá tham khảo</Label>
                <Input
                  id="svc-price"
                  value={form.priceFrom}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priceFrom: e.target.value }))
                  }
                  placeholder="Từ 150.000đ"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="svc-order">Thứ tự</Label>
                <Input
                  id="svc-order"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sortOrder: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="svc-note">Ghi chú</Label>
              <Textarea
                id="svc-note"
                value={form.note}
                onChange={(e) =>
                  setForm((f) => ({ ...f, note: e.target.value }))
                }
                rows={2}
                placeholder="Báo giá trước khi sửa"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
                className="size-4 rounded border-input"
              />
              Hiển thị trên bảng giá
            </label>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {editing ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
