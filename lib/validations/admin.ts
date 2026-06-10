import { z } from "zod";
import { appointmentStatusEnum, verificationStatusEnum } from "@/db/schema";
import { normalizeSpaces } from "@/lib/input-normalizers";

const STATUS_VALUES = appointmentStatusEnum.enumValues;

export const adminListFilterSchema = z.object({
  status: z.enum(STATUS_VALUES).optional(),
  q: z.string().trim().min(1).max(50).transform(normalizeSpaces).optional(),
  limit: z.coerce.number().int().positive().max(50).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export const appointmentStatusUpdateSchema = z.object({
  status: z.enum(STATUS_VALUES),
});

const VERIFICATION_STATUS_VALUES = verificationStatusEnum.enumValues;

export const verificationReviewSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"]),
    rejectReason: z
      .string()
      .trim()
      .max(255, "Lý do tối đa 255 ký tự")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.status === "APPROVED" || !!data.rejectReason?.trim(), {
    message: "Nhập lý do khi từ chối minh chứng",
    path: ["rejectReason"],
  });

export const adminVerificationFilterSchema = z.object({
  status: z.enum(VERIFICATION_STATUS_VALUES).optional(),
});

export type AdminListFilter = z.infer<typeof adminListFilterSchema>;
export type AppointmentStatusUpdate = z.infer<
  typeof appointmentStatusUpdateSchema
>;
export type VerificationReview = z.infer<typeof verificationReviewSchema>;

export const adminSettingsSchema = z.object({
  verificationDiscountPercent: z.coerce
    .number()
    .int("Phần trăm phải là số nguyên")
    .min(0, "Tối thiểu 0%")
    .max(100, "Tối đa 100%"),
});

export type AdminSettings = z.infer<typeof adminSettingsSchema>;
