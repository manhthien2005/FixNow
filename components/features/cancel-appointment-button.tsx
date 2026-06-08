"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/components/i18n/language-provider";

interface CancelAppointmentButtonProps {
  code: string;
}

export function CancelAppointmentButton({
  code,
}: CancelAppointmentButtonProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function onConfirm() {
    setIsPending(true);
    try {
      const res = await fetch(
        `/api/appointments/${encodeURIComponent(code)}/cancel`,
        { method: "POST" },
      );

      if (res.status === 200) {
        toast.success(
          locale === "vi" ? "Đã huỷ lịch hẹn." : "Appointment cancelled.",
        );
        setOpen(false);
        router.refresh();
        return;
      }

      if (res.status === 409) {
        toast.warning(
          locale === "vi"
            ? "Lịch hẹn không thể huỷ ở trạng thái hiện tại."
            : "This appointment cannot be cancelled in its current status.",
        );
        setOpen(false);
        router.refresh();
        return;
      }

      toast.error(
        locale === "vi"
          ? "Không thể huỷ lịch hẹn. Vui lòng thử lại."
          : "Could not cancel the appointment. Please try again.",
      );
    } catch {
      toast.error(
        locale === "vi"
          ? "Không thể huỷ lịch hẹn. Vui lòng thử lại."
          : "Could not cancel the appointment. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          {locale === "vi" ? "Huỷ lịch hẹn" : "Cancel appointment"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {locale === "vi"
              ? "Xác nhận huỷ lịch hẹn?"
              : "Cancel this appointment?"}
          </DialogTitle>
          <DialogDescription>
            {locale === "vi"
              ? "Hành động này không thể hoàn tác. FixNow sẽ không liên hệ lại theo lịch này."
              : "This action cannot be undone. FixNow will not contact you for this appointment."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              {locale === "vi" ? "Đóng" : "Close"}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? locale === "vi"
                ? "Đang huỷ..."
                : "Cancelling..."
              : locale === "vi"
                ? "Xác nhận huỷ"
                : "Confirm cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
