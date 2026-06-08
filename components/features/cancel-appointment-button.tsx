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

interface CancelAppointmentButtonProps {
  code: string;
}

export function CancelAppointmentButton({
  code,
}: CancelAppointmentButtonProps) {
  const router = useRouter();
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
        toast.success("Đã huỷ lịch hẹn.");
        setOpen(false);
        router.refresh();
        return;
      }

      if (res.status === 409) {
        toast.warning("Lịch hẹn không thể huỷ ở trạng thái hiện tại.");
        setOpen(false);
        router.refresh();
        return;
      }

      toast.error("Không thể huỷ lịch hẹn. Vui lòng thử lại.");
    } catch {
      toast.error("Không thể huỷ lịch hẹn. Vui lòng thử lại.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Huỷ lịch hẹn</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận huỷ lịch hẹn?</DialogTitle>
          <DialogDescription>
            Hành động này không thể hoàn tác. FixNow sẽ không liên hệ lại theo
            lịch này.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Đóng
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Đang huỷ..." : "Xác nhận huỷ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
