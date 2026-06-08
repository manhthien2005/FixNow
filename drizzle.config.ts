import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

// Load .env.local + .env files like Next.js does, so drizzle-kit
// sees DATABASE_URL from .env.local (gitignored secrets).
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  strict: true,
  verbose: true,
});
