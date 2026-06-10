"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/components/i18n/language-provider";

interface VerificationReviewActionsProps {
  id: string;
  disabled?: boolean;
}

export function VerificationReviewActions({
  id,
  disabled = false,
}: VerificationReviewActionsProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const isVi = locale === "vi";
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState<"APPROVED" | "REJECTED" | null>(null);

  async function review(status: "APPROVED" | "REJECTED") {
    setLoading(status);
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectReason }),
      });
      if (!res.ok) {
        toast.error(isVi ? "Không thể cập nhật duyệt." : "Could not update review.");
        return;
      }
      toast.success(isVi ? "Đã cập nhật duyệt." : "Review updated.");
      router.refresh();
    } catch {
      toast.error(isVi ? "Lỗi mạng, vui lòng thử lại." : "Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={rejectReason}
        onChange={(event) => setRejectReason(event.target.value.slice(0, 255))}
        placeholder={isVi ? "Lý do từ chối nếu có" : "Reject reason if needed"}
        className="min-h-20 text-base md:text-sm"
        disabled={disabled}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          className="h-10"
          disabled={disabled || loading !== null}
          onClick={() => review("APPROVED")}
        >
          {loading === "APPROVED"
            ? isVi
              ? "Đang duyệt..."
              : "Approving..."
            : isVi
              ? "Duyệt"
              : "Approve"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="h-10"
          disabled={disabled || loading !== null}
          onClick={() => review("REJECTED")}
        >
          {loading === "REJECTED"
            ? isVi
              ? "Đang từ chối..."
              : "Rejecting..."
            : isVi
              ? "Từ chối"
              : "Reject"}
        </Button>
      </div>
    </div>
  );
}
