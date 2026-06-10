import { z } from "zod";
import { phoneRegex } from "./auth";
import { normalizePhoneValue, normalizeSpaces } from "@/lib/input-normalizers";

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
  phone: z
    .string()
    .trim()
    .transform(normalizePhoneValue)
    .refine((value) => phoneRegex.test(value), {
      message: "Số điện thoại không hợp lệ",
    }),
  code: appointmentCodeSchema,
});

export const bookingSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Họ tên ít nhất 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự")
    .transform(normalizeSpaces),
  phone: z
    .string()
    .trim()
    .transform(normalizePhoneValue)
    .refine((value) => phoneRegex.test(value), {
      message: "Số điện thoại không hợp lệ",
    }),
  address: z
    .string()
    .trim()
    .min(5, "Địa chỉ không hợp lệ")
    .max(255, "Địa chỉ tối đa 255 ký tự")
    .transform(normalizeSpaces),
  deviceType: z.enum(["LAPTOP", "PC", "PRINTER", "OTHER"], {
    errorMap: () => ({ message: "Chọn loại thiết bị" }),
  }),
  serviceGroup: z.string().min(1, "Chọn nhóm dịch vụ"),
  issueDescription: z
    .string()
    .trim()
    .min(10, "Mô tả lỗi ít nhất 10 ký tự")
    .max(2000, "Mô tả lỗi tối đa 2000 ký tự"),
  preferredTime: z
    .string()
    .datetime({ message: "Thời gian không hợp lệ" })
    .refine((value) => new Date(value).getTime() >= Date.now(), {
      message: "Vui lòng chọn thời gian từ hiện tại trở đi",
    })
    .optional()
    .or(z.literal("")),
  useVerificationDiscount: z.boolean().optional().default(false),
});

export const bookingApiSchema = bookingSchema;
export const bookingFormSchema = bookingSchema;

export type AppointmentCodeParams = z.infer<typeof appointmentCodeParamsSchema>;
export type AppointmentTrackQuery = z.infer<typeof appointmentTrackQuerySchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type BookingApiInput = z.infer<typeof bookingApiSchema>;
export type BookingFormInput = z.infer<typeof bookingFormSchema>;
