import type {
  AppointmentStatus,
  DeviceType,
  PartType,
  Role,
} from "@/db/schema";
import { getDictionary, type Locale } from "@/lib/i18n";

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  RECEIVED: "Đã nhận",
  IN_PROGRESS: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export const APPOINTMENT_STATUS_VARIANT: Record<
  AppointmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  RECEIVED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export const DEVICE_TYPE_LABEL: Record<DeviceType, string> = {
  LAPTOP: "Laptop",
  PC: "Máy tính bàn (PC)",
  PRINTER: "Máy in",
  OTHER: "Thiết bị khác",
};

export const PART_TYPE_LABEL: Record<PartType, string> = {
  RAM: "RAM",
  SSD: "SSD",
  HDD: "HDD",
  BATTERY: "Pin",
  ACCESSORY: "Phụ kiện",
};

export const ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: "Khách hàng",
  ADMIN: "Quản trị viên",
};

export const SERVICE_GROUPS = [
  "Kiểm tra & chẩn đoán",
  "Sửa lỗi phần mềm",
  "Bảo trì phần cứng",
  "Nâng cấp linh kiện",
  "Hỗ trợ thiết bị văn phòng",
  "Hỗ trợ từ xa",
] as const;

export type ServiceGroup = (typeof SERVICE_GROUPS)[number];

export function getAppointmentStatusLabel(
  status: AppointmentStatus,
  locale: Locale,
): string {
  return getDictionary(locale).labels.appointmentStatus[status];
}

export function getDeviceTypeLabel(type: DeviceType, locale: Locale): string {
  return getDictionary(locale).labels.deviceType[type];
}

export function getPartTypeLabel(type: PartType, locale: Locale): string {
  return getDictionary(locale).labels.partType[type];
}

export function getRoleLabel(role: Role, locale: Locale): string {
  return getDictionary(locale).labels.role[role];
}

export function getServiceGroupLabel(group: string, locale: Locale): string {
  const index = SERVICE_GROUPS.findIndex((value) => value === group);
  return index >= 0 ? getDictionary(locale).labels.serviceGroups[index] : group;
}
