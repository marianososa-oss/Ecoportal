/**
 * Utilidades de semana ISO para el "foco semanal".
 * La clave (`2026-W30`) agrupa las entradas de una misma semana, arrancando el
 * lunes. Semana ISO = la que contiene el jueves.
 */

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Clave estable de la semana ISO, ej. "2026-W30". */
export function isoWeekKey(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7; // lunes=1 … domingo=7
  date.setUTCDate(date.getUTCDate() + 4 - day); // jueves de esta semana
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** Lunes y domingo (local) de la semana que contiene `d`. */
export function weekRange(d: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(d);
  const day = (start.getDay() + 6) % 7; // lunes=0
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

/** Etiqueta amigable, ej. "Semana del 21 al 27 de julio". */
export function weekRangeLabel(d: Date = new Date()): string {
  const { start, end } = weekRange(d);
  if (start.getMonth() === end.getMonth()) {
    return `Semana del ${start.getDate()} al ${end.getDate()} de ${MESES[end.getMonth()]}`;
  }
  return `Semana del ${start.getDate()} de ${MESES[start.getMonth()]} al ${end.getDate()} de ${MESES[end.getMonth()]}`;
}
