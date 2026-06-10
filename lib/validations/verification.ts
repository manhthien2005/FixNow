import { z } from "zod";
import { verificationSubjectEnum } from "@/db/schema";
import { normalizeSpaces } from "@/lib/input-normalizers";

export const verificationUploadFieldsSchema = z.object({
  subject: z.enum(verificationSubjectEnum.enumValues),
  organization: z
    .string()
    .trim()
    .min(2, "Tên trường/công ty ít nhất 2 ký tự")
    .max(120, "Tên trường/công ty tối đa 120 ký tự")
    .transform(normalizeSpaces),
  identifier: z
    .string()
    .trim()
    .max(80, "Mã học sinh/sinh viên/nhân viên tối đa 80 ký tự")
    .transform(normalizeSpaces)
    .optional()
    .or(z.literal("")),
});

export type VerificationUploadFields = z.infer<
  typeof verificationUploadFieldsSchema
>;
