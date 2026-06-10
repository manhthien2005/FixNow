"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Percent } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/i18n/language-provider";

export function VerificationDiscountForm({
  initialPercent,
}: {
  initialPercent: number;
}) {
  const router = useRouter();
  const { locale } = useI18n();
  const isVi = locale === "vi";
  const [percent, setPercent] = useState(String(initialPercent));
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(percent);
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      toast.error(
        isVi ? "Nhập số nguyên từ 0 đến 100." : "Enter an integer from 0 to 100.",
      );
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationDiscountPercent: value }),
      });
      if (!res.ok) {
        toast.error(isVi ? "Không thể lưu cài đặt." : "Could not save settings.");
        return;
      }
      toast.success(isVi ? "Đã lưu mức ưu đãi." : "Discount saved.");
      router.refresh();
    } catch {
      toast.error(
        isVi ? "Lỗi mạng, vui lòng thử lại." : "Network error. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-sm space-y-3">
      <Label htmlFor="discount-percent">
        {isVi ? "Mức ưu đãi xác thực (%)" : "Verified discount (%)"}
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            id="discount-percent"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            step={1}
            value={percent}
            onChange={(event) => setPercent(event.target.value)}
            className="h-11 pr-9 text-base"
          />
          <Percent className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button type="submit" disabled={saving} className="h-11">
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {isVi ? "Lưu" : "Save"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {isVi
          ? "Đặt 0 để tạm tắt ưu đãi. Các đơn đã tạo trước đó không thay đổi."
          : "Set 0 to disable the discount. Existing bookings are unchanged."}
      </p>
    </form>
  );
}
