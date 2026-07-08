"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/user";
import { updateUserProfile } from "@/db/queries";

/** Guarda los datos editables del empleado logueado. */
export async function updateProfileAction(data: {
  firstName: string;
  lastName: string;
  area: string;
  phone?: string;
  birthday?: string;
}) {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  await updateUserProfile(user.id, {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    area: data.area.trim(),
    ...(data.phone !== undefined ? { phone: data.phone.trim() } : {}),
    ...(data.birthday !== undefined ? { birthday: data.birthday.trim() } : {}),
  });
  revalidatePath("/");
  revalidatePath("/gente");
  revalidatePath("/perfil");
  revalidatePath("/firma");
  return { ok: true };
}
