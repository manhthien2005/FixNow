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
export const verificationSubjectEnum = pgEnum("verification_subject", [
  "PUPIL",
  "STUDENT",
  "EMPLOYEE",
]);
export const verificationStatusEnum = pgEnum("verification_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
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
    email: text("email").notNull(),
    emailVerifiedAt: timestamp("email_verified_at"),
    emailVerificationCodeHash: text("email_verification_code_hash"),
    emailVerificationExpiresAt: timestamp("email_verification_expires_at"),
    emailVerificationAttempts: integer("email_verification_attempts")
      .notNull()
      .default(0),
    emailVerificationSentAt: timestamp("email_verification_sent_at"),
    verificationDiscountUsedAt: timestamp("verification_discount_used_at"),
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
    discountPercent: integer("discount_percent").notNull().default(0),
    discountReason: text("discount_reason"),
    verificationDiscountApplied: boolean("verification_discount_applied")
      .notNull()
      .default(false),
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

export const userVerifications = pgTable(
  "user_verifications",
  {
    id: varchar("id", { length: 32 })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subject: verificationSubjectEnum("subject").notNull(),
    organization: text("organization").notNull(),
    identifier: text("identifier"),
    proofPath: text("proof_path").notNull(),
    status: verificationStatusEnum("status").notNull().default("PENDING"),
    reviewerId: varchar("reviewer_id", { length: 32 }).references(
      () => users.id,
      { onDelete: "set null" },
    ),
    rejectReason: text("reject_reason"),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("user_verifications_user_idx").on(t.userId),
    statusIdx: index("user_verifications_status_idx").on(t.status),
  }),
);

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userAddresses = pgTable(
  "user_addresses",
  {
    id: varchar("id", { length: 32 })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: text("label"),
    address: text("address").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("user_addresses_user_idx").on(t.userId),
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
  addresses: many(userAddresses),
  verifications: many(userVerifications, { relationName: "verificationUser" }),
  reviewedVerifications: many(userVerifications, {
    relationName: "verificationReviewer",
  }),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
}));

export const userVerificationsRelations = relations(
  userVerifications,
  ({ one }) => ({
    user: one(users, {
      fields: [userVerifications.userId],
      references: [users.id],
      relationName: "verificationUser",
    }),
    reviewer: one(users, {
      fields: [userVerifications.reviewerId],
      references: [users.id],
      relationName: "verificationReviewer",
    }),
  }),
);

// --- Inferred types ---
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type UserVerification = typeof userVerifications.$inferSelect;
export type NewUserVerification = typeof userVerifications.$inferInsert;
export type AppSetting = typeof appSettings.$inferSelect;
export type NewAppSetting = typeof appSettings.$inferInsert;
export type UserAddress = typeof userAddresses.$inferSelect;
export type NewUserAddress = typeof userAddresses.$inferInsert;
export type ServicePrice = typeof servicePrices.$inferSelect;
export type NewServicePrice = typeof servicePrices.$inferInsert;
export type Part = typeof parts.$inferSelect;
export type NewPart = typeof parts.$inferInsert;

export type Role = (typeof roleEnum.enumValues)[number];
export type DeviceType = (typeof deviceTypeEnum.enumValues)[number];
export type AppointmentStatus = (typeof appointmentStatusEnum.enumValues)[number];
export type PartType = (typeof partTypeEnum.enumValues)[number];
export type VerificationSubject =
  (typeof verificationSubjectEnum.enumValues)[number];
export type VerificationStatus =
  (typeof verificationStatusEnum.enumValues)[number];
