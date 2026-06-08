import {
  pgTable,
  pgEnum,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// --- Enums ---
export const roleEnum = pgEnum("role", ["CUSTOMER", "ADMIN"]);
export const deviceTypeEnum = pgEnum("device_type", [
  "LAPTOP",
  "PC",
  "PRINTER",
  "OTHER",
]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "RECEIVED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);
export const partTypeEnum = pgEnum("part_type", [
  "RAM",
  "SSD",
  "HDD",
  "BATTERY",
  "ACCESSORY",
]);

// --- Tables ---
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 32 })
      .primaryKey()
      .$defaultFn(() => createId()),
    fullName: text("full_name").notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: text("email"),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("CUSTOMER"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    phoneUnique: uniqueIndex("users_phone_unique").on(t.phone),
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
  }),
);

export const appointments = pgTable(
  "appointments",
  {
    id: varchar("id", { length: 32 })
      .primaryKey()
      .$defaultFn(() => createId()),
    appointmentCode: varchar("appointment_code", { length: 20 }).notNull(),
    userId: varchar("user_id", { length: 32 }).references(() => users.id, {
      onDelete: "set null",
    }),
    customerName: text("customer_name").notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    address: text("address").notNull(),
    deviceType: deviceTypeEnum("device_type").notNull(),
    serviceGroup: text("service_group").notNull(),
    issueDescription: text("issue_description").notNull(),
    preferredTime: timestamp("preferred_time"),
    status: appointmentStatusEnum("status").notNull().default("RECEIVED"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    codeUnique: uniqueIndex("appointments_code_unique").on(t.appointmentCode),
    userIdx: index("appointments_user_idx").on(t.userId),
    phoneIdx: index("appointments_phone_idx").on(t.phone),
    statusIdx: index("appointments_status_idx").on(t.status),
    createdIdx: index("appointments_created_idx").on(t.createdAt),
  }),
);

export const servicePrices = pgTable(
  "service_prices",
  {
    id: varchar("id", { length: 32 })
      .primaryKey()
      .$defaultFn(() => createId()),
    serviceName: text("service_name").notNull(),
    priceFrom: text("price_from").notNull(),
    note: text("note"),
    imagePath: text("image_path"),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    nameUnique: uniqueIndex("service_prices_name_unique").on(t.serviceName),
    activeIdx: index("service_prices_active_idx").on(t.isActive),
  }),
);

export const parts = pgTable(
  "parts",
  {
    id: varchar("id", { length: 32 })
      .primaryKey()
      .$defaultFn(() => createId()),
    type: partTypeEnum("type").notNull(),
    name: text("name").notNull(),
    price: text("price").notNull(),
    warranty: text("warranty"),
    note: text("note"),
    imagePath: text("image_path"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    nameUnique: uniqueIndex("parts_name_unique").on(t.name),
    typeIdx: index("parts_type_idx").on(t.type),
    activeIdx: index("parts_active_idx").on(t.isActive),
  }),
);

// --- Relations ---
export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
}));

// --- Inferred types ---
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type ServicePrice = typeof servicePrices.$inferSelect;
export type NewServicePrice = typeof servicePrices.$inferInsert;
export type Part = typeof parts.$inferSelect;
export type NewPart = typeof parts.$inferInsert;

export type Role = (typeof roleEnum.enumValues)[number];
export type DeviceType = (typeof deviceTypeEnum.enumValues)[number];
export type AppointmentStatus = (typeof appointmentStatusEnum.enumValues)[number];
export type PartType = (typeof partTypeEnum.enumValues)[number];
