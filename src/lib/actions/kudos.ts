"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/user";
import { createKudo } from "@/db/queries";

export async function giveKudoAction(toUserId: number, mensaje: string) {
  const user = await getCurrentUser();
  if (!user || !toUserId || !mensaje.trim()) return { ok: false };
  if (toUserId === user.id) return { ok: false };
  await createKudo(user.id, toUserId, mensaje);
  revalidatePath("/gente");
  return { ok: true };
}
