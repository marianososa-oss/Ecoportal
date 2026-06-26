import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "./index";
import { users, tasks, events } from "./schema";
import type { User, Task, Event } from "./schema";

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

/** Crea o actualiza el empleado a partir del perfil de Google. */
export async function upsertUserFromGoogle(p: GoogleProfile): Promise<User> {
  const email = p.email.toLowerCase();
  const existing = await getUserByEmail(email);

  if (existing) {
    const [row] = await db
      .update(users)
      .set({
        googleSub: p.sub,
        name: p.name ?? existing.name,
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
      name: p.name ?? "",
      firstName: p.givenName ?? "",
      lastName: p.familyName ?? "",
      avatarUrl: p.picture ?? "",
      googleRefreshToken: p.refreshToken ?? "",
      lastLoginAt: new Date(),
    })
    .returning();
  return row;
}

export async function updateUserProfile(
  id: number,
  data: Partial<Pick<User, "firstName" | "lastName" | "area" | "jobTitle" | "onboardingDone" | "tourDone">>,
): Promise<User> {
  const [row] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return row;
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
