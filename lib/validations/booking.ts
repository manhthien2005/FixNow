import { z } from "zod";
import { phoneRegex } from "./auth";

const appointmentCodeRegex = /^FN-\d{4}-\d{4}$/;

export const appointmentCodeSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .refine((value) => appointmentCodeRegex.test(value), {
    message: "Mã lịch hẹn phải có dạng FN-YYYY-XXXX",
  });

export const appointmentCodeParamsSchema = z.object({
  code: appointmentCodeSchema,
});

export const appointmentTrackQuerySchema = z.object({
  phone: z.string().trim().regex(phoneRegex, "Số điện thoại không hợp lệ"),
  code: appointmentCodeSchema,
});

export const bookingSchema = z.object({
  customerName: z
    .string()
    .min(2, "Họ tên ít nhất 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự"),
  phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
  address: z
    .string()
    .min(5, "Địa chỉ không hợp lệ")
    .max(255, "Địa chỉ tối đa 255 ký tự"),
  deviceType: z.enum(["LAPTOP", "PC", "PRINTER", "OTHER"], {
    errorMap: () => ({ message: "Chọn loại thiết bị" }),
  }),
  serviceGroup: z.string().min(1, "Chọn nhóm dịch vụ"),
  issueDescription: z
    .string()
    .min(10, "Mô tả lỗi ít nhất 10 ký tự")
    .max(2000, "Mô tả lỗi tối đa 2000 ký tự"),
  preferredTime: z
    .string()
    .datetime({ message: "Thời gian không hợp lệ" })
    .optional()
    .or(z.literal("")),
});

export type AppointmentCodeParams = z.infer<typeof appointmentCodeParamsSchema>;
export type AppointmentTrackQuery = z.infer<typeof appointmentTrackQuerySchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
