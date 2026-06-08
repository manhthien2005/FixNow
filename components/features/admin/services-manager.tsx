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
import {
  INPUT_LIMITS,
  limitText,
  normalizeSpaces,
  sanitizeIntegerInput,
} from "@/lib/input-normalizers";
import { useI18n } from "@/components/i18n/language-provider";

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
  const { locale } = useI18n();
  const isVi = locale === "vi";
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
      setError(
        isVi
          ? "Vui lòng nhập tên dịch vụ (>=2 ký tự) và giá."
          : "Please enter a service name (at least 2 characters) and price.",
      );
      return;
    }
    setSaving(true);
    try {
      const payload = {
        serviceName: normalizeSpaces(form.serviceName),
        priceFrom: normalizeSpaces(form.priceFrom),
        note: form.note.trim() ? normalizeSpaces(form.note) : null,
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
        setError(
          data.message ??
            (isVi ? "Lưu thất bại. Kiểm tra lại dữ liệu." : "Save failed. Check the data again."),
        );
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError(isVi ? "Lỗi mạng khi lưu." : "Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(s: ServicePrice) {
    if (
      !confirm(
        isVi
          ? `Xóa dịch vụ "${s.serviceName}"?`
          : `Delete service "${s.serviceName}"?`,
      )
    ) {
      return;
    }
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
          {initialServices.length} {isVi ? "dịch vụ" : "services"}
        </p>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          {isVi ? "Thêm dịch vụ" : "Add service"}
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
                    {isVi ? "Ẩn" : "Hidden"}
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
              {editing
                ? isVi
                  ? "Sửa dịch vụ"
                  : "Edit service"
                : isVi
                  ? "Thêm dịch vụ"
                  : "Add service"}
            </DialogTitle>
            <DialogDescription>
              {isVi
                ? "Thông tin hiển thị trên trang bảng giá dịch vụ."
                : "Information shown on the public pricing page."}
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
              <Label htmlFor="svc-name">
                {isVi ? "Tên dịch vụ" : "Service name"}
              </Label>
              <Input
                id="svc-name"
                value={form.serviceName}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    serviceName: limitText(
                      e.target.value,
                      INPUT_LIMITS.catalogName,
                    ),
                  }))
                }
                onBlur={(e) =>
                  setForm((f) => ({
                    ...f,
                    serviceName: normalizeSpaces(e.target.value),
                  }))
                }
                placeholder={
                  isVi
                    ? "Vệ sinh laptop / PC + tra keo tản nhiệt"
                    : "Laptop / PC cleaning + thermal paste"
                }
                maxLength={INPUT_LIMITS.catalogName}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="svc-price">
                  {isVi ? "Giá tham khảo" : "Reference price"}
                </Label>
                <Input
                  id="svc-price"
                  value={form.priceFrom}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      priceFrom: limitText(e.target.value, INPUT_LIMITS.price),
                    }))
                  }
                  onBlur={(e) =>
                    setForm((f) => ({
                      ...f,
                      priceFrom: normalizeSpaces(e.target.value),
                    }))
                  }
                  placeholder={isVi ? "Từ 150.000đ" : "From 150,000 VND"}
                  maxLength={INPUT_LIMITS.price}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="svc-order">
                  {isVi ? "Thứ tự" : "Sort order"}
                </Label>
                <Input
                  id="svc-order"
                  type="number"
                  min={0}
                  max={INPUT_LIMITS.sortOrderMax}
                  inputMode="numeric"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sortOrder: sanitizeIntegerInput(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="svc-note">{isVi ? "Ghi chú" : "Note"}</Label>
              <Textarea
                id="svc-note"
                value={form.note}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    note: limitText(e.target.value, INPUT_LIMITS.note),
                  }))
                }
                onBlur={(e) =>
                  setForm((f) => ({
                    ...f,
                    note: e.target.value.trim()
                      ? normalizeSpaces(e.target.value)
                      : "",
                  }))
                }
                rows={2}
                placeholder={isVi ? "Báo giá trước khi sửa" : "Quote before repair"}
                maxLength={INPUT_LIMITS.note}
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
              {isVi ? "Hiển thị trên bảng giá" : "Show on pricing page"}
            </label>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {isVi ? "Hủy" : "Cancel"}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {editing
                ? isVi
                  ? "Lưu thay đổi"
                  : "Save changes"
                : isVi
                  ? "Tạo mới"
                  : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
