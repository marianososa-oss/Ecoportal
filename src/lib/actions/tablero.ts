"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/user";
import {
  addTask,
  updateTask,
  deleteTask,
  addEvent,
  deleteEvent,
} from "@/db/queries";

async function uid() {
  const u = await getCurrentUser();
  return u?.id ?? null;
}

/* ── Tareas ───────────────────────────────────────────────────────────── */

export async function addTaskAction(titulo: string, cuando: string) {
  const id = await uid();
  if (!id || !titulo.trim()) return;
  await addTask(id, titulo.trim(), cuando.trim() || "Sin fecha");
  revalidatePath("/");
}

export async function toggleTaskAction(taskId: number, estado: "pendiente" | "completa") {
  const id = await uid();
  if (!id) return;
  await updateTask(id, taskId, {
    estado: estado === "completa" ? "pendiente" : "completa",
  });
  revalidatePath("/");
}

export async function editTaskAction(taskId: number, titulo: string) {
  const id = await uid();
  if (!id || !titulo.trim()) return;
  await updateTask(id, taskId, { titulo: titulo.trim() });
  revalidatePath("/");
}

export async function deleteTaskAction(taskId: number) {
  const id = await uid();
  if (!id) return;
  await deleteTask(id, taskId);
  revalidatePath("/");
}

/* ── Eventos ──────────────────────────────────────────────────────────── */

export async function addEventAction(titulo: string, cuando: string, tipo: string) {
  const id = await uid();
  if (!id || !titulo.trim()) return;
  await addEvent(id, titulo.trim(), cuando.trim() || "Próximamente", tipo);
  revalidatePath("/");
}

export async function deleteEventAction(eventId: number) {
  const id = await uid();
  if (!id) return;
  await deleteEvent(id, eventId);
  revalidatePath("/");
}
