import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, getSession } from "@/lib/auth";
import { getUserById } from "@/db/queries";
import type { User } from "@/db/schema";

/** Empleado logueado (o null). Lee la cookie de sesión y trae la fila. */
export async function getCurrentUser(): Promise<User | null> {
  // Solo en desarrollo: usuario ficticio para previsualizar el portal logueado.
  if (process.env.NODE_ENV !== "production" && process.env.MOCK_USER === "1") {
    return {
      id: 0,
      googleSub: "mock",
      email: "demo@ecocontrol.com.ar",
      name: "Demo Empleado",
      firstName: "Demo",
      lastName: "Empleado",
      area: "Marketing",
      jobTitle: "",
      avatarUrl: "",
      role: "employee",
      googleRefreshToken: "",
      onboardingDone: false,
      tourDone: false,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  }

  const store = await cookies();
  const session = await getSession(store.get(SESSION_COOKIE)?.value);
  if (!session?.uid) return null;
  try {
    return await getUserById(session.uid);
  } catch {
    return null;
  }
}
