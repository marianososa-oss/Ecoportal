/** Vista serializable de la identidad del usuario (para pasar a componentes). */
export type Identidad = {
  nombre: string;
  firstName: string;
  lastName: string;
  area: string;
  email: string;
  avatarUrl: string;
  phone: string;
  birthday: string;
  pct: number;
};

export function completitud(firstName: string, lastName: string, area: string): number {
  const campos = [firstName, lastName, area];
  const llenos = campos.filter((c) => c.trim()).length;
  return Math.round((llenos / campos.length) * 100);
}

/** Convierte el usuario de la base en la vista de identidad. */
export function toIdentidad(u: {
  name: string;
  firstName: string;
  lastName: string;
  area: string;
  email: string;
  avatarUrl: string;
  phone?: string;
  birthday?: string;
}): Identidad {
  const nombre =
    `${u.firstName} ${u.lastName}`.trim() || u.name || u.email.split("@")[0];
  return {
    nombre,
    firstName: u.firstName,
    lastName: u.lastName,
    area: u.area,
    email: u.email,
    avatarUrl: u.avatarUrl,
    phone: u.phone ?? "",
    birthday: u.birthday ?? "",
    pct: completitud(u.firstName, u.lastName, u.area),
  };
}
