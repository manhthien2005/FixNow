import { z } from "zod";
import {
  INPUT_LIMITS,
  normalizePhoneValue,
  normalizeSpaces,
} from "@/lib/input-normalizers";

export const phoneRegex = /^0(3|5|7|8|9)\d{8}$/;

const phoneSchema = z
  .string()
  .trim()
  .transform(normalizePhoneValue)
  .refine((value) => phoneRegex.test(value), {
    message: "Số điện thoại không hợp lệ",
  });

const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Họ tên ít nhất 2 ký tự")
  .max(INPUT_LIMITS.name, "Họ tên tối đa 100 ký tự")
  .transform(normalizeSpaces);

const optionalEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(INPUT_LIMITS.email, "Email tối đa 254 ký tự")
  .email("Email không hợp lệ")
  .optional()
  .or(z.literal(""));

const passwordSchema = z
  .string()
  .min(6, "Mật khẩu ít nhất 6 ký tự")
  .max(INPUT_LIMITS.password, "Mật khẩu tối đa 72 ký tự");

export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    phone: phoneSchema,
    email: optionalEmailSchema,
    password: passwordSchema,
    confirmPassword: z.string().max(INPUT_LIMITS.password),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Nhập số điện thoại hoặc email")
    .max(INPUT_LIMITS.email, "Thông tin đăng nhập quá dài"),
  password: z
    .string()
    .min(1, "Nhập mật khẩu")
    .max(INPUT_LIMITS.password, "Mật khẩu tối đa 72 ký tự"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const updateProfileSchema = z.object({
  fullName: fullNameSchema,
  email: optionalEmailSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Nhập mật khẩu hiện tại")
      .max(INPUT_LIMITS.password, "Mật khẩu tối đa 72 ký tự"),
    newPassword: passwordSchema,
    confirmPassword: z.string().max(INPUT_LIMITS.password),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z
  .object({
    phone: phoneSchema,
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(INPUT_LIMITS.email, "Email tối đa 254 ký tự")
      .email("Email không hợp lệ"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới ít nhất 6 ký tự")
      .max(INPUT_LIMITS.password, "Mật khẩu tối đa 72 ký tự"),
    confirmPassword: z.string().max(INPUT_LIMITS.password),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
