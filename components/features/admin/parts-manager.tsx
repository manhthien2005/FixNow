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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/features/admin/image-upload";
import { PART_TYPE_LABEL } from "@/lib/labels";
import { resolvePartImage } from "@/lib/images";
import { partTypeEnum, type Part, type PartType } from "@/db/schema";

const TYPES = partTypeEnum.enumValues;

type FormState = {
  type: PartType;
  name: string;
  price: string;
  warranty: string;
  note: string;
  imagePath: string | null;
  isActive: boolean;
};

const emptyForm: FormState = {
  type: "RAM",
  name: "",
  price: "",
  warranty: "",
  note: "",
  imagePath: null,
  isActive: true,
};

function toForm(part: Part): FormState {
  return {
    type: part.type,
    name: part.name,
    price: part.price,
    warranty: part.warranty ?? "",
    note: part.note ?? "",
    imagePath: part.imagePath ?? null,
    isActive: part.isActive,
  };
}

export function PartsManager({ initialParts }: { initialParts: Part[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Part | null>(null);
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

  function openEdit(part: Part) {
    setEditing(part);
    setForm(toForm(part));
    setError(null);
    setOpen(true);
  }

  async function handleSave() {
    setError(null);
    if (form.name.trim().length < 2 || form.price.trim().length < 1) {
      setError("Vui lòng nhập tên (≥2 ký tự) và giá.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        name: form.name.trim(),
        price: form.price.trim(),
        warranty: form.warranty.trim() || null,
        note: form.note.trim() || null,
        imagePath: form.imagePath,
        isActive: form.isActive,
      };
      const res = await fetch(
        editing ? `/api/admin/parts/${editing.id}` : "/api/admin/parts",
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

  async function handleDelete(part: Part) {
    if (!confirm(`Xóa linh kiện "${part.name}"?`)) return;
    setDeletingId(part.id);
    try {
      const res = await fetch(`/api/admin/parts/${part.id}`, {
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
          {initialParts.length} linh kiện
        </p>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Thêm linh kiện
        </Button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {initialParts.map((part) => (
          <div
            key={part.id}
            className="flex gap-3 rounded-xl border bg-card p-3"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={resolvePartImage(part.imagePath, part.type)}
                alt={part.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                  {PART_TYPE_LABEL[part.type]}
                </span>
                {!part.isActive ? (
                  <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                    Ẩn
                  </span>
                ) : null}
              </div>
              <p className="mt-1 truncate text-sm font-semibold">{part.name}</p>
              <p className="text-sm font-bold text-primary">{part.price}</p>
              <div className="mt-2 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2"
                  onClick={() => openEdit(part)}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(part)}
                  disabled={deletingId === part.id}
                >
                  {deletingId === part.id ? (
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
              {editing ? "Sửa linh kiện" : "Thêm linh kiện"}
            </DialogTitle>
            <DialogDescription>
              Thông tin hiển thị trên trang tra cứu linh kiện.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <ImageUpload
              folder="parts"
              value={form.imagePath}
              onChange={(path) => setForm((f) => ({ ...f, imagePath: path }))}
              fallbackSrc={resolvePartImage(null, form.type)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="part-type">Loại</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, type: v as PartType }))
                  }
                >
                  <SelectTrigger id="part-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {PART_TYPE_LABEL[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="part-price">Giá</Label>
                <Input
                  id="part-price"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="650.000đ"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="part-name">Tên / thông số</Label>
              <Input
                id="part-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="RAM Laptop DDR4 8GB 3200MHz"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="part-warranty">Bảo hành</Label>
                <Input
                  id="part-warranty"
                  value={form.warranty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, warranty: e.target.value }))
                  }
                  placeholder="36 tháng"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isActive: e.target.checked }))
                    }
                    className="size-4 rounded border-input"
                  />
                  Hiển thị
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="part-note">Ghi chú</Label>
              <Textarea
                id="part-note"
                value={form.note}
                onChange={(e) =>
                  setForm((f) => ({ ...f, note: e.target.value }))
                }
                rows={2}
                placeholder="Crucial / Kingston"
              />
            </div>

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
