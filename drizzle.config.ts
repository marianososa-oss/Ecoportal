import { config } from "dotenv";
config({ path: ".env.local" });
config(); // .env como fallback
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // La unpooled (directa) va mejor para migraciones/push.
    url:
      process.env.DATABASE_URL_UNPOOLED ??
      process.env.DATABASE_URL ??
      process.env.POSTGRES_URL ??
      "",
  },
});
