import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Empleados de Ecocontrol. Se crean/actualizan solos al iniciar sesión con
 * Google (SSO restringido a @ecocontrol.com.ar). Base de "Mi Portal".
 */
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    /** identificador estable de Google (claim "sub"). */
    googleSub: text("google_sub").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name").default("").notNull(),
    firstName: text("first_name").default("").notNull(),
    lastName: text("last_name").default("").notNull(),
    /** área / sector, ej. "Marketing", "Ingeniería". */
    area: text("area").default("").notNull(),
    /** puesto, para la firma. */
    jobTitle: text("job_title").default("").notNull(),
    avatarUrl: text("avatar_url").default("").notNull(),
    /** teléfono / interno para el directorio. */
    phone: text("phone").default("").notNull(),
    /** cumpleaños en formato "MM-DD" (sin año). */
    birthday: text("birthday").default("").notNull(),
    /** "employee" | "rrhh" | "admin". */
    role: text("role").default("employee").notNull(),
    /** refresh token de Google para leer su Calendar del lado servidor. */
    googleRefreshToken: text("google_refresh_token").default("").notNull(),
    onboardingDone: boolean("onboarding_done").default(false).notNull(),
    tourDone: boolean("tour_done").default(false).notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("users_email_idx").on(t.email)],
);

/** Tareas personales del tablero. */
export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    titulo: text("titulo").notNull(),
    cuando: text("cuando").default("").notNull(),
    /** "pendiente" | "completa" */
    estado: text("estado").default("pendiente").notNull(),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("tasks_user_idx").on(t.userId)],
);

/** Eventos del área ("lo que se viene"). */
export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    titulo: text("titulo").notNull(),
    cuando: text("cuando").default("").notNull(),
    /** "capacitacion" | "cumple" | "evento" */
    tipo: text("tipo").default("evento").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("events_user_idx").on(t.userId)],
);

/** Solicitudes de autogestión (vacaciones, licencias, etc.). */
export const requests = pgTable(
  "requests",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** "vacaciones" | "licencia" | "home_office" | "otro" */
    tipo: text("tipo").notNull(),
    desde: text("desde").default("").notNull(), // "YYYY-MM-DD"
    hasta: text("hasta").default("").notNull(),
    motivo: text("motivo").default("").notNull(),
    /** "pendiente" | "aprobada" | "rechazada" */
    estado: text("estado").default("pendiente").notNull(),
    decidedBy: integer("decided_by"),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("requests_user_idx").on(t.userId)],
);

/** Reconocimientos (kudos) entre compañeros. */
export const kudos = pgTable(
  "kudos",
  {
    id: serial("id").primaryKey(),
    fromUserId: integer("from_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toUserId: integer("to_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mensaje: text("mensaje").default("").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("kudos_to_idx").on(t.toUserId)],
);

/**
 * Sugerencias de mejora (del portal, de un proceso, de un lugar…). Pueden ser
 * anónimas: en ese caso `userId` queda en null y no se muestra el autor.
 */
export const suggestions = pgTable(
  "suggestions",
  {
    id: serial("id").primaryKey(),
    /** autor; null si se envió de forma anónima. */
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    anonimo: boolean("anonimo").default(false).notNull(),
    /** "sistema" | "proceso" | "lugar" | "otro" */
    categoria: text("categoria").default("otro").notNull(),
    texto: text("texto").notNull(),
    /** "nueva" | "en_revision" | "hecha" | "descartada" */
    estado: text("estado").default("nueva").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("suggestions_estado_idx").on(t.estado)],
);

/** Apoyos (+1) a una sugerencia. Uno por persona por sugerencia. */
export const suggestionVotes = pgTable(
  "suggestion_votes",
  {
    id: serial("id").primaryKey(),
    suggestionId: integer("suggestion_id")
      .notNull()
      .references(() => suggestions.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("suggestion_votes_unique").on(t.suggestionId, t.userId)],
);

/**
 * Foco semanal: en qué está trabajando cada persona esta semana. Una entrada
 * editable por persona y por semana (clave `semana` en formato ISO "2026-W30").
 */
export const worklogs = pgTable(
  "worklogs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    semana: text("semana").notNull(),
    /** "obra" | "desarrollo" | "oficina" | "otro" */
    tipo: text("tipo").default("oficina").notNull(),
    titulo: text("titulo").notNull(),
    /** dónde (sobre todo cuando el tipo es "obra"). */
    lugar: text("lugar").default("").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("worklogs_user_week").on(t.userId, t.semana)],
);

export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Request = typeof requests.$inferSelect;
export type Kudo = typeof kudos.$inferSelect;
export type Suggestion = typeof suggestions.$inferSelect;
export type Worklog = typeof worklogs.$inferSelect;
