"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/user";
import { createRequest, decideRequest } from "@/db/queries";

export async function createRequestAction(data: {
  tipo: string;
  desde: string;
  hasta: string;
  motivo: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  if (!data.tipo) return { ok: false };
  await createRequest(user.id, data.tipo, data.desde, data.hasta, data.motivo.trim());
  revalidatePath("/autogestion");
  return { ok: true };
}

export async function decideRequestAction(id: number, estado: "aprobada" | "rechazada") {
  const user = await getCurrentUser();
  if (!user || (user.role !== "rrhh" && user.role !== "admin")) return { ok: false };
  await decideRequest(id, estado, user.id);
  revalidatePath("/autogestion");
  return { ok: true };
}
