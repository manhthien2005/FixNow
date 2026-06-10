CREATE TYPE "public"."verification_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."verification_subject" AS ENUM('PUPIL', 'STUDENT', 'EMPLOYEE');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_verifications" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"subject" "verification_subject" NOT NULL,
	"organization" text NOT NULL,
	"identifier" text,
	"proof_path" text NOT NULL,
	"status" "verification_status" DEFAULT 'PENDING' NOT NULL,
	"reviewer_id" varchar(32),
	"reject_reason" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "discount_percent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "discount_reason" text;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "verification_discount_applied" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verification_code_hash" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verification_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verification_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verification_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_discount_used_at" timestamp;--> statement-breakpoint
UPDATE "users"
SET "email_verified_at" = now()
WHERE "email" IS NOT NULL AND "email" <> '';--> statement-breakpoint
UPDATE "users"
SET "email" = concat('user-', "id", '@fixnow.local')
WHERE "email" IS NULL OR "email" = '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_verifications" ADD CONSTRAINT "user_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_verifications" ADD CONSTRAINT "user_verifications_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_verifications_user_idx" ON "user_verifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_verifications_status_idx" ON "user_verifications" USING btree ("status");
