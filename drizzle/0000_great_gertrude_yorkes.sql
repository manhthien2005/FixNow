CREATE TYPE "public"."appointment_status" AS ENUM('RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."device_type" AS ENUM('LAPTOP', 'PC', 'PRINTER', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."part_type" AS ENUM('RAM', 'SSD', 'HDD', 'BATTERY', 'ACCESSORY');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('CUSTOMER', 'ADMIN');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointments" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"appointment_code" varchar(20) NOT NULL,
	"user_id" varchar(32),
	"customer_name" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"address" text NOT NULL,
	"device_type" "device_type" NOT NULL,
	"service_group" text NOT NULL,
	"issue_description" text NOT NULL,
	"preferred_time" timestamp,
	"status" "appointment_status" DEFAULT 'RECEIVED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parts" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"type" "part_type" NOT NULL,
	"name" text NOT NULL,
	"price" text NOT NULL,
	"warranty" text,
	"note" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_prices" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"service_name" text NOT NULL,
	"price_from" text NOT NULL,
	"note" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" text,
	"password_hash" text NOT NULL,
	"role" "role" DEFAULT 'CUSTOMER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "appointments_code_unique" ON "appointments" USING btree ("appointment_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointments_user_idx" ON "appointments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointments_phone_idx" ON "appointments" USING btree ("phone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointments_status_idx" ON "appointments" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "appointments_created_idx" ON "appointments" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "parts_name_unique" ON "parts" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parts_type_idx" ON "parts" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parts_active_idx" ON "parts" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "service_prices_name_unique" ON "service_prices" USING btree ("service_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "service_prices_active_idx" ON "service_prices" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_phone_unique" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" USING btree ("email");