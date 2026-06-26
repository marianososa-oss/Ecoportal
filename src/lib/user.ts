import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, getSession } from "@/lib/auth";
import { getUserById } from "@/db/queries";
import type { User } from "@/db/schema";

/** Empleado logueado (o null). Lee la cookie de sesión y trae la fila. */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const session = await getSession(store.get(SESSION_COOKIE)?.value);
  if (!session?.uid) return null;
  try {
    return await getUserById(session.uid);
  } catch {
    return null;
  }
}
