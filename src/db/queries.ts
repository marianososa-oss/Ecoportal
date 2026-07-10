import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "./index";
import { users, tasks, events, requests, kudos } from "./schema";
import type { User, Task, Event, Request } from "./schema";

/* ── Usuarios ─────────────────────────────────────────────────────────── */

export async function getUserById(id: number): Promise<User | null> {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return row ?? null;
}

type GoogleProfile = {
  sub: string;
  email: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  refreshToken?: string;
};

/** Saca sufijos tipo "(Ecocontrol)" que agregan las cuentas de Google. */
export function limpiarNombre(s: string | undefined | null): string {
  return (s ?? "")
    .replace(/\s*\([^)]*ecocontrol[^)]*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Crea o actualiza el empleado a partir del perfil de Google. */
export async function upsertUserFromGoogle(p: GoogleProfile): Promise<User> {
  const email = p.email.toLowerCase();
  const nombre = limpiarNombre(p.name);
  const given = limpiarNombre(p.givenName);
  const family = limpiarNombre(p.familyName);
  const existing = await getUserByEmail(email);

  if (existing) {
    const [row] = await db
      .update(users)
      .set({
        googleSub: p.sub,
        name: nombre || existing.name,
        avatarUrl: p.picture ?? existing.avatarUrl,
        ...(p.refreshToken ? { googleRefreshToken: p.refreshToken } : {}),
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id))
      .returning();
    return row;
  }

  const [row] = await db
    .insert(users)
    .values({
      googleSub: p.sub,
      email,
      name: nombre,
      firstName: given,
      lastName: family,
      avatarUrl: p.picture ?? "",
      googleRefreshToken: p.refreshToken ?? "",
      lastLoginAt: new Date(),
    })
    .returning();
  return row;
}

export async function updateUserProfile(
  id: number,
  data: Partial<
    Pick<User, "firstName" | "lastName" | "area" | "jobTitle" | "phone" | "birthday" | "onboardingDone" | "tourDone">
  >,
): Promise<User> {
  const [row] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return row;
}

/** Todo el personal para el directorio (ordenado por área y nombre). */
export async function getDirectorio(): Promise<User[]> {
  return db
    .select()
    .from(users)
    .orderBy(asc(users.area), asc(users.firstName), asc(users.lastName));
}

/** Cumpleaños del mes indicado (1–12), ordenados por día. */
export async function getCumpleaniosDelMes(mes: number): Promise<User[]> {
  const mm = String(mes).padStart(2, "0");
  const todos = await db.select().from(users);
  return todos
    .filter((u) => u.birthday && u.birthday.slice(0, 2) === mm)
    .sort((a, b) => a.birthday.localeCompare(b.birthday));
}

/* ── Tareas ───────────────────────────────────────────────────────────── */

export async function getTasks(userId: number): Promise<Task[]> {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(asc(tasks.position), asc(tasks.id));
}

export async function addTask(userId: number, titulo: string, cuando: string): Promise<Task> {
  const [row] = await db
    .insert(tasks)
    .values({ userId, titulo, cuando })
    .returning();
  return row;
}

export async function updateTask(
  userId: number,
  id: number,
  data: Partial<Pick<Task, "titulo" | "cuando" | "estado">>,
): Promise<void> {
  await db.update(tasks).set(data).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

export async function deleteTask(userId: number, id: number): Promise<void> {
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

/* ── Eventos ──────────────────────────────────────────────────────────── */

export async function getEvents(userId: number): Promise<Event[]> {
  return db
    .select()
    .from(events)
    .where(eq(events.userId, userId))
    .orderBy(asc(events.id));
}

export async function addEvent(
  userId: number,
  titulo: string,
  cuando: string,
  tipo: string,
): Promise<Event> {
  const [row] = await db
    .insert(events)
    .values({ userId, titulo, cuando, tipo })
    .returning();
  return row;
}

export async function deleteEvent(userId: number, id: number): Promise<void> {
  await db.delete(events).where(and(eq(events.id, id), eq(events.userId, userId)));
}

/* ── Solicitudes (autogestión) ────────────────────────────────────────── */

export async function getMyRequests(userId: number): Promise<Request[]> {
  return db
    .select()
    .from(requests)
    .where(eq(requests.userId, userId))
    .orderBy(desc(requests.createdAt));
}

export async function createRequest(
  userId: number,
  tipo: string,
  desde: string,
  hasta: string,
  motivo: string,
): Promise<Request> {
  const [row] = await db
    .insert(requests)
    .values({ userId, tipo, desde, hasta, motivo })
    .returning();
  return row;
}

export type RequestConSolicitante = {
  id: number;
  tipo: string;
  desde: string;
  hasta: string;
  motivo: string;
  estado: string;
  createdAt: Date;
  nombre: string;
  area: string;
  email: string;
};

/** Solicitudes pendientes con datos del solicitante (para RRHH). */
export async function getPendingRequests(): Promise<RequestConSolicitante[]> {
  const rows = await db
    .select({
      id: requests.id,
      tipo: requests.tipo,
      desde: requests.desde,
      hasta: requests.hasta,
      motivo: requests.motivo,
      estado: requests.estado,
      createdAt: requests.createdAt,
      firstName: users.firstName,
      lastName: users.lastName,
      name: users.name,
      area: users.area,
      email: users.email,
    })
    .from(requests)
    .innerJoin(users, eq(requests.userId, users.id))
    .where(eq(requests.estado, "pendiente"))
    .orderBy(desc(requests.createdAt));

  return rows.map((r) => ({
    id: r.id,
    tipo: r.tipo,
    desde: r.desde,
    hasta: r.hasta,
    motivo: r.motivo,
    estado: r.estado,
    createdAt: r.createdAt,
    nombre: `${r.firstName} ${r.lastName}`.trim() || r.name || r.email.split("@")[0],
    area: r.area,
    email: r.email,
  }));
}

export async function decideRequest(
  id: number,
  estado: "aprobada" | "rechazada",
  deciderId: number,
): Promise<void> {
  await db
    .update(requests)
    .set({ estado, decidedBy: deciderId, decidedAt: new Date() })
    .where(eq(requests.id, id));
}

/* ── Reconocimientos (kudos) ──────────────────────────────────────────── */

export async function createKudo(fromUserId: number, toUserId: number, mensaje: string) {
  await db.insert(kudos).values({ fromUserId, toUserId, mensaje: mensaje.trim() });
}

export type KudoView = {
  id: number;
  mensaje: string;
  createdAt: Date;
  de: string;
  para: string;
  paraArea: string;
  paraAvatar: string;
};

export async function getRecentKudos(limit = 12): Promise<KudoView[]> {
  const f = alias(users, "kudo_from");
  const t = alias(users, "kudo_to");
  const rows = await db
    .select({
      id: kudos.id,
      mensaje: kudos.mensaje,
      createdAt: kudos.createdAt,
      deFirst: f.firstName, deLast: f.lastName, deName: f.name, deEmail: f.email,
      paraFirst: t.firstName, paraLast: t.lastName, paraName: t.name, paraEmail: t.email,
      paraArea: t.area, paraAvatar: t.avatarUrl,
    })
    .from(kudos)
    .innerJoin(f, eq(kudos.fromUserId, f.id))
    .innerJoin(t, eq(kudos.toUserId, t.id))
    .orderBy(desc(kudos.createdAt))
    .limit(limit);

  const nombre = (fn: string, ln: string, nm: string, em: string) =>
    `${fn} ${ln}`.trim() || nm || em.split("@")[0];

  return rows.map((r) => ({
    id: r.id,
    mensaje: r.mensaje,
    createdAt: r.createdAt,
    de: nombre(r.deFirst, r.deLast, r.deName, r.deEmail),
    para: nombre(r.paraFirst, r.paraLast, r.paraName, r.paraEmail),
    paraArea: r.paraArea,
    paraAvatar: r.paraAvatar,
  }));
}
