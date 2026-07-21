"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/user";
import { updateUserProfile } from "@/db/queries";

/** Marca el tour guiado como hecho (o lo reinicia). */
export async function setTourDoneAction(done: boolean) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  await updateUserProfile(user.id, { tourDone: done });
  revalidatePath("/");
  revalidatePath("/tour");
  return { ok: true };
}
