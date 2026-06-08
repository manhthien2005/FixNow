import type {
  AppointmentStatus,
  DeviceType,
  PartType,
  Role,
} from "@/db/schema";

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
