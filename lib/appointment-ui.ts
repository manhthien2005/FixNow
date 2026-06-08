import {
  CircleCheck,
  CircleX,
  HardDrive,
  Inbox,
  Laptop,
  Monitor,
  Printer,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { AppointmentStatus, DeviceType } from "@/db/schema";

/**
 * Presentation config for appointment statuses + device types — shared by the
 * list and detail pages so colours/icons stay consistent. Class strings are
 * literals so Tailwind JIT can see them. Uses default Tailwind amber/emerald
 * (still available — tailwind.config extends, not replaces, the palette).
 */
export type StatusUi = {
  label: string;
  icon: LucideIcon;
  text: string;
  dot: string;
  bg: string;
  border: string;
};

export const STATUS_UI: Record<AppointmentStatus, StatusUi> = {
  RECEIVED: {
    label: "Đã nhận",
    icon: Inbox,
    text: "text-secondary",
    dot: "bg-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/30",
  },
  IN_PROGRESS: {
    label: "Đang xử lý",
    icon: Wrench,
    text: "text-amber-400",
    dot: "bg-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
  COMPLETED: {
    label: "Hoàn thành",
    icon: CircleCheck,
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: CircleX,
    text: "text-destructive",
    dot: "bg-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
  },
};

export const DEVICE_ICON: Record<DeviceType, LucideIcon> = {
  LAPTOP: Laptop,
  PC: Monitor,
  PRINTER: Printer,
  OTHER: HardDrive,
};

/** Linear progress order; CANCELLED is rendered as an escape state, not a step. */
export const STATUS_STEPS: AppointmentStatus[] = [
  "RECEIVED",
  "IN_PROGRESS",
  "COMPLETED",
];
