import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// No tiramos error al importar (así el build pasa sin DATABASE_URL); la
// conexión real se valida al hacer la primera consulta.
const url =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  "postgresql://user:pass@sin-configurar.neon.tech/db?sslmode=require";

const sql = neon(url);
export const db = drizzle(sql, { schema });
