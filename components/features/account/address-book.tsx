"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Home, Loader2, MapPin, Plus, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/i18n/language-provider";
import { INPUT_LIMITS, limitText, normalizeSpaces } from "@/lib/input-normalizers";

export interface AddressItem {
  id: string;
  label: string | null;
  address: string;
  isDefault: boolean;
}

export function AddressBook({ initial }: { initial: AddressItem[] }) {
  const router = useRouter();
  const { locale } = useI18n();
  const isVi = locale === "vi";
  const [items, setItems] = useState<AddressItem[]>(initial);
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    if (address.trim().length < 5) {
      toast.error(isVi ? "Địa chỉ không hợp lệ." : "Invalid address.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: normalizeSpaces(label),
          address: normalizeSpaces(address),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        address?: AddressItem;
        message?: string;
      };
      if (!res.ok || !data.address) {
        toast.error(
          data.message ??
            (isVi ? "Không thể thêm địa chỉ." : "Could not add address."),
        );
        return;
      }
      setItems((prev) =>
        data.address!.isDefault
          ? [data.address!, ...prev.map((a) => ({ ...a, isDefault: false }))]
          : [...prev, data.address!],
      );
      setLabel("");
      setAddress("");
      toast.success(isVi ? "Đã thêm địa chỉ." : "Address added.");
      router.refresh();
    } catch {
      toast.error(isVi ? "Lỗi mạng, vui lòng thử lại." : "Network error.");
    } finally {
      setAdding(false);
    }
  }

  async function makeDefault(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.ok) {
        toast.error(isVi ? "Không thể cập nhật." : "Could not update.");
        return;
      }
      setItems((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
      router.refresh();
    } catch {
      toast.error(isVi ? "Lỗi mạng, vui lòng thử lại." : "Network error.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error(isVi ? "Không thể xoá địa chỉ." : "Could not delete.");
        return;
      }
      setItems((prev) => {
        const next = prev.filter((a) => a.id !== id);
        // Reflect server-side default promotion locally.
        if (next.length > 0 && !next.some((a) => a.isDefault)) {
          next[0] = { ...next[0], isDefault: true };
        }
        return next;
      });
      toast.success(isVi ? "Đã xoá địa chỉ." : "Address deleted.");
      router.refresh();
    } catch {
      toast.error(isVi ? "Lỗi mạng, vui lòng thử lại." : "Network error.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="glass-panel rounded-2xl p-6 md:p-8">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
          <Home className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-headline-sm text-on-surface">
            {isVi ? "Sổ địa chỉ" : "Address book"}
          </h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {isVi
              ? "Lưu các địa chỉ thường dùng để đặt lịch nhanh hơn."
              : "Save your frequent addresses for faster booking."}
          </p>
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-start gap-3 rounded-xl border border-border bg-surface-container/40 p-4"
            >
              <MapPin className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {item.label ? (
                    <span className="font-semibold text-on-surface">
                      {item.label}
                    </span>
                  ) : null}
                  {item.isDefault ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-label-sm font-medium text-emerald-500">
                      <Star className="size-3" aria-hidden="true" />
                      {isVi ? "Mặc định" : "Default"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 break-words text-body-md text-on-surface-variant">
                  {item.address}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {!item.isDefault ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9"
                    disabled={busyId === item.id}
                    onClick={() => makeDefault(item.id)}
                  >
                    {isVi ? "Đặt mặc định" : "Set default"}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-destructive hover:text-destructive"
                  aria-label={isVi ? "Xoá" : "Delete"}
                  disabled={busyId === item.id}
                  onClick={() => remove(item.id)}
                >
                  {busyId === item.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-border p-4 text-body-md text-on-surface-variant">
          {isVi ? "Chưa có địa chỉ nào." : "No saved addresses yet."}
        </p>
      )}

      <form onSubmit={add} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="addr-label">
            {isVi ? "Nhãn (tuỳ chọn)" : "Label (optional)"}
          </Label>
          <Input
            id="addr-label"
            value={label}
            onChange={(event) => setLabel(limitText(event.target.value, 60))}
            placeholder={isVi ? "Nhà, Công ty..." : "Home, Office..."}
            className="h-11 text-base"
            maxLength={60}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="addr-address">{isVi ? "Địa chỉ" : "Address"}</Label>
          <Input
            id="addr-address"
            value={address}
            onChange={(event) =>
              setAddress(limitText(event.target.value, INPUT_LIMITS.address))
            }
            placeholder={isVi ? "Số nhà, đường, phường..." : "Street, ward..."}
            className="h-11 text-base"
            maxLength={INPUT_LIMITS.address}
          />
        </div>
        <Button
          type="submit"
          disabled={adding}
          className="h-11 w-full sm:col-span-2 sm:w-max"
        >
          {adding ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          {isVi ? "Thêm địa chỉ" : "Add address"}
        </Button>
      </form>
    </section>
  );
}
