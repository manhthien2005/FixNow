import { z } from "zod";
import { partTypeEnum } from "@/db/schema";
import { normalizeSpaces } from "@/lib/input-normalizers";

const PART_TYPES = partTypeEnum.enumValues;

// Optional text that normalizes "" → null (so empty inputs clear the column).
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? normalizeSpaces(v) : null));

const imagePath = z
  .string()
  .trim()
  .max(255)
  .optional()
  .nullable()
  .transform((v) => (v ? v : null));

const optionalQueryText = (max: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().min(1).max(max).optional(),
  );

const optionalPartType = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.enum(PART_TYPES).optional(),
);

export const publicPartsQuerySchema = z.object({
  type: optionalPartType,
  q: optionalQueryText(50),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export const partCreateSchema = z.object({
  type: z.enum(PART_TYPES),
  name: z
    .string()
    .trim()
    .min(2, "Tên linh kiện tối thiểu 2 ký tự")
    .max(150)
    .transform(normalizeSpaces),
  price: z
    .string()
    .trim()
    .min(1, "Bắt buộc nhập giá")
    .max(50)
    .transform(normalizeSpaces),
  warranty: optionalText(50),
  note: optionalText(255),
  imagePath,
  isActive: z.boolean().default(true),
});

// Edit: every field optional (partial update) but validated when present.
export const partUpdateSchema = partCreateSchema.partial();

export const servicePriceCreateSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(2, "Tên dịch vụ tối thiểu 2 ký tự")
    .max(150)
    .transform(normalizeSpaces),
  priceFrom: z
    .string()
    .trim()
    .min(1, "Bắt buộc nhập giá")
    .max(50)
    .transform(normalizeSpaces),
  note: optionalText(255),
  imagePath,
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const servicePriceUpdateSchema = servicePriceCreateSchema.partial();

export type PartCreate = z.infer<typeof partCreateSchema>;
export type PartUpdate = z.infer<typeof partUpdateSchema>;
export type PublicPartsQuery = z.infer<typeof publicPartsQuerySchema>;
export type ServicePriceCreate = z.infer<typeof servicePriceCreateSchema>;
export type ServicePriceUpdate = z.infer<typeof servicePriceUpdateSchema>;
