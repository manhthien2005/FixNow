"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AppointmentStatus } from "@/db/schema";
import {
  ADMIN_STATUS_TRANSITIONS,
  isTerminalStatus,
} from "@/lib/appointment-status";
import { APPOINTMENT_STATUS_VARIANT } from "@/lib/labels";
import { useI18n } from "@/components/i18n/language-provider";

interface AdminStatusChangerProps {
  code: string;
  currentStatus: AppointmentStatus;
}

const NEXT_VARIANT: Record<
  AppointmentStatus,
  "default" | "destructive" | "outline" | "secondary"
> = {
  RECEIVED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export function AdminStatusChanger({
  code,
  currentStatus,
}: AdminStatusChangerProps) {
  const router = useRouter();
  const { dictionary, locale } = useI18n();
  const [pending, setPending] = useState<AppointmentStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isTerminalStatus(currentStatus)) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Badge variant={APPOINTMENT_STATUS_VARIANT[currentStatus]}>
          {dictionary.labels.appointmentStatus[currentStatus]}
        </Badge>
        <p className="text-sm text-muted-foreground">
          {locale === "vi"
            ? "Trạng thái đã chốt, không thể thay đổi."
            : "This status is final and cannot be changed."}
        </p>
      </div>
    );
  }

  const nextStatuses = ADMIN_STATUS_TRANSITIONS[currentStatus];
  const pendingIsTerminal = pending ? isTerminalStatus(pending) : false;

  async function onConfirm() {
    if (!pending) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/appointments/${encodeURIComponent(code)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: pending }),
        },
      );

      if (res.status === 200) {
        toast.success(
          locale === "vi" ? "Đã cập nhật trạng thái." : "Status updated.",
        );
        setPending(null);
        router.refresh();
        return;
      }

      if (res.status === 409) {
        toast.warning(locale === "vi" ? "Trạng thái không hợp lệ." : "Invalid status.");
        setPending(null);
        router.refresh();
        return;
      }

      if (res.status === 401 || res.status === 403) {
        toast.error(locale === "vi" ? "Bạn không có quyền." : "You do not have permission.");
        return;
      }

      toast.error(locale === "vi" ? "Có lỗi xảy ra." : "Something went wrong.");
    } catch {
      toast.error(locale === "vi" ? "Có lỗi xảy ra." : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-sm text-muted-foreground">
          {locale === "vi" ? "Trạng thái hiện tại:" : "Current status:"}
        </span>
        <Badge variant={APPOINTMENT_STATUS_VARIANT[currentStatus]}>
          {dictionary.labels.appointmentStatus[currentStatus]}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((next) => (
          <Button
            key={next}
            type="button"
            variant={NEXT_VARIANT[next]}
            onClick={() => setPending(next)}
          >
            {locale === "vi" ? "Chuyển sang" : "Move to"}{" "}
            {dictionary.labels.appointmentStatus[next]}
          </Button>
        ))}
      </div>

      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pending
                ? locale === "vi"
                  ? `Đổi trạng thái thành ${dictionary.labels.appointmentStatus[pending]}?`
                  : `Change status to ${dictionary.labels.appointmentStatus[pending]}?`
                : locale === "vi"
                  ? "Đổi trạng thái?"
                  : "Change status?"}
            </DialogTitle>
            {pendingIsTerminal ? (
              <DialogDescription>
                {locale === "vi"
                  ? "Hành động này không thể hoàn tác cho các trạng thái Hoàn thành / Đã hủy."
                  : "This action cannot be undone for Completed / Cancelled statuses."}
              </DialogDescription>
            ) : (
              <DialogDescription>
                {locale === "vi"
                  ? `Cập nhật trạng thái lịch hẹn ${code}.`
                  : `Update appointment ${code}.`}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={submitting}>
                {locale === "vi" ? "Đóng" : "Close"}
              </Button>
            </DialogClose>
            <Button
              variant={pending ? NEXT_VARIANT[pending] : "default"}
              onClick={onConfirm}
              disabled={submitting}
            >
              {submitting
                ? locale === "vi"
                  ? "Đang cập nhật..."
                  : "Updating..."
                : locale === "vi"
                  ? "Xác nhận"
                  : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
