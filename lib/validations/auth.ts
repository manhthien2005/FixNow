import { z } from "zod";

export const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Họ tên ít nhất 2 ký tự")
      .max(100, "Họ tên tối đa 100 ký tự"),
    phone: z
      .string()
      .regex(phoneRegex, "Số điện thoại không hợp lệ"),
    email: z
      .string()
      .email("Email không hợp lệ")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "Mật khẩu ít nhất 6 ký tự")
      .max(72, "Mật khẩu tối đa 72 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z.string().min(1, "Nhập số điện thoại hoặc email"),
  password: z.string().min(1, "Nhập mật khẩu"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên ít nhất 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự"),
  email: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới ít nhất 6 ký tự")
      .max(72, "Mật khẩu tối đa 72 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z
  .object({
    phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
    email: z.string().trim().email("Email không hợp lệ"),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới ít nhất 6 ký tự")
      .max(72, "Mật khẩu tối đa 72 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
