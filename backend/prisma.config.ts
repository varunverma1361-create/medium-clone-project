import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Local Prisma CLI (migrations/status/studio) connects directly to Neon.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DIRECT_URL") },
});
