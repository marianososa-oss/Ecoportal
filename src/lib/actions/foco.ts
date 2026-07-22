"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/user";
import { upsertWorklog, deleteWorklog } from "@/db/queries";
import { isoWeekKey } from "@/lib/week";

const TIPOS = ["obra", "desarrollo", "oficina", "otro"];

export async function saveFocoAction(data: { tipo: string; titulo: string; lugar: string }) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const titulo = data.titulo.trim();
  if (!titulo) return { ok: false };
  const tipo = TIPOS.includes(data.tipo) ? data.tipo : "oficina";
  const lugar = tipo === "obra" ? data.lugar.trim() : "";
  await upsertWorklog(user.id, isoWeekKey(), { tipo, titulo, lugar });
  revalidatePath("/trabajamos");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteFocoAction() {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  await deleteWorklog(user.id, isoWeekKey());
  revalidatePath("/trabajamos");
  revalidatePath("/");
  return { ok: true };
}
