import { z } from "zod";
import { appointmentStatusEnum } from "@/db/schema";

const STATUS_VALUES = appointmentStatusEnum.enumValues;

export const adminListFilterSchema = z.object({
  status: z.enum(STATUS_VALUES).optional(),
  q: z.string().trim().min(1).max(50).optional(),
  limit: z.coerce.number().int().positive().max(50).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export const appointmentStatusUpdateSchema = z.object({
  status: z.enum(STATUS_VALUES),
});

export type AdminListFilter = z.infer<typeof adminListFilterSchema>;
export type AppointmentStatusUpdate = z.infer<
  typeof appointmentStatusUpdateSchema
>;
