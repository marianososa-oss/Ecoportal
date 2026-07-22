"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/user";
import {
  createSuggestion,
  toggleSuggestionVote,
  setSuggestionEstado,
  deleteSuggestion,
} from "@/db/queries";

const CATEGORIAS = ["sistema", "proceso", "lugar", "otro"];
const ESTADOS = ["nueva", "en_revision", "hecha", "descartada"];

export async function createSuggestionAction(data: {
  texto: string;
  categoria: string;
  anonimo: boolean;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const texto = data.texto.trim();
  if (!texto) return { ok: false };
  const categoria = CATEGORIAS.includes(data.categoria) ? data.categoria : "otro";
  await createSuggestion(user.id, texto, categoria, !!data.anonimo);
  revalidatePath("/sugerencias");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleVoteAction(suggestionId: number) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  await toggleSuggestionVote(suggestionId, user.id);
  revalidatePath("/sugerencias");
  revalidatePath("/");
  return { ok: true };
}

/** Cambiar estado: solo RRHH / admin. */
export async function setEstadoAction(id: number, estado: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "rrhh" && user.role !== "admin")) return { ok: false };
  if (!ESTADOS.includes(estado)) return { ok: false };
  await setSuggestionEstado(id, estado);
  revalidatePath("/sugerencias");
  return { ok: true };
}

/** Borrar sugerencia: solo RRHH / admin. */
export async function deleteSuggestionAction(id: number) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "rrhh" && user.role !== "admin")) return { ok: false };
  await deleteSuggestion(id);
  revalidatePath("/sugerencias");
  return { ok: true };
}
