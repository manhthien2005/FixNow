import { z } from "zod";
import { INPUT_LIMITS, normalizeSpaces } from "@/lib/input-normalizers";

export const addressCreateSchema = z.object({
  label: z
    .string()
    .trim()
    .max(60, "Nhãn tối đa 60 ký tự")
    .transform(normalizeSpaces)
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .min(5, "Địa chỉ không hợp lệ")
    .max(INPUT_LIMITS.address, "Địa chỉ tối đa 255 ký tự")
    .transform(normalizeSpaces),
  isDefault: z.boolean().optional().default(false),
});

export const addressUpdateSchema = addressCreateSchema.partial();

export type AddressCreateInput = z.infer<typeof addressCreateSchema>;
export type AddressUpdateInput = z.infer<typeof addressUpdateSchema>;
