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
import {
  INPUT_LIMITS,
  limitText,
  normalizeSpaces,
} from "@/lib/input-normalizers";
import { useI18n } from "@/components/i18n/language-provider";

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
  const { dictionary, locale } = useI18n();
  const isVi = locale === "vi";
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
      setError(
        isVi
          ? "Vui lòng nhập tên (>=2 ký tự) và giá."
          : "Please enter a name (at least 2 characters) and price.",
      );
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        name: normalizeSpaces(form.name),
        price: normalizeSpaces(form.price),
        warranty: form.warranty.trim() ? normalizeSpaces(form.warranty) : null,
        note: form.note.trim() ? normalizeSpaces(form.note) : null,
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

  async function handleDelete(part: Part) {
    if (
      !confirm(
        isVi
          ? `Xóa linh kiện "${part.name}"?`
          : `Delete part "${part.name}"?`,
      )
    ) {
      return;
    }
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
          {initialParts.length} {isVi ? "linh kiện" : "parts"}
        </p>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          {isVi ? "Thêm linh kiện" : "Add part"}
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
                  {dictionary.labels.partType[part.type] ??
                    PART_TYPE_LABEL[part.type]}
                </span>
                {!part.isActive ? (
                  <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                    {isVi ? "Ẩn" : "Hidden"}
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
              {editing
                ? isVi
                  ? "Sửa linh kiện"
                  : "Edit part"
                : isVi
                  ? "Thêm linh kiện"
                  : "Add part"}
            </DialogTitle>
            <DialogDescription>
              {isVi
                ? "Thông tin hiển thị trên trang tra cứu linh kiện."
                : "Information shown on the public parts catalog."}
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
                <Label htmlFor="part-type">{isVi ? "Loại" : "Type"}</Label>
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
                        {dictionary.labels.partType[t] ?? PART_TYPE_LABEL[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="part-price">{isVi ? "Giá" : "Price"}</Label>
                <Input
                  id="part-price"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      price: limitText(e.target.value, INPUT_LIMITS.price),
                    }))
                  }
                  onBlur={(e) =>
                    setForm((f) => ({
                      ...f,
                      price: normalizeSpaces(e.target.value),
                    }))
                  }
                  placeholder="650.000đ"
                  maxLength={INPUT_LIMITS.price}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="part-name">
                {isVi ? "Tên / thông số" : "Name / specification"}
              </Label>
              <Input
                id="part-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    name: limitText(e.target.value, INPUT_LIMITS.catalogName),
                  }))
                }
                onBlur={(e) =>
                  setForm((f) => ({
                    ...f,
                    name: normalizeSpaces(e.target.value),
                  }))
                }
                placeholder="RAM Laptop DDR4 8GB 3200MHz"
                maxLength={INPUT_LIMITS.catalogName}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="part-warranty">
                  {isVi ? "Bảo hành" : "Warranty"}
                </Label>
                <Input
                  id="part-warranty"
                  value={form.warranty}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      warranty: limitText(
                        e.target.value,
                        INPUT_LIMITS.warranty,
                      ),
                    }))
                  }
                  onBlur={(e) =>
                    setForm((f) => ({
                      ...f,
                      warranty: e.target.value.trim()
                        ? normalizeSpaces(e.target.value)
                        : "",
                    }))
                  }
                  placeholder={isVi ? "36 tháng" : "36 months"}
                  maxLength={INPUT_LIMITS.warranty}
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
                  {isVi ? "Hiển thị" : "Visible"}
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="part-note">{isVi ? "Ghi chú" : "Note"}</Label>
              <Textarea
                id="part-note"
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
                placeholder="Crucial / Kingston"
                maxLength={INPUT_LIMITS.note}
              />
            </div>

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
