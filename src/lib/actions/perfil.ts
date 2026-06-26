"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/user";
import { updateUserProfile } from "@/db/queries";

/** Guarda nombre/apellido/área del empleado logueado. */
export async function updateProfileAction(data: {
  firstName: string;
  lastName: string;
  area: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  await updateUserProfile(user.id, {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    area: data.area.trim(),
  });
  revalidatePath("/dashboard");
  revalidatePath("/perfil");
  revalidatePath("/firma");
  return { ok: true };
}
