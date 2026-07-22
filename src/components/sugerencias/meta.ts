/** Categorías y estados de las sugerencias, con etiqueta y color de marca. */

export type Meta = { id: string; label: string; tone: string };

export const CATEGORIAS: Meta[] = [
  { id: "sistema", label: "Sistema", tone: "var(--eco-humedad)" },
  { id: "proceso", label: "Proceso", tone: "var(--eco-aire)" },
  { id: "lugar", label: "Lugar / espacio", tone: "var(--eco-monitoreo)" },
  { id: "otro", label: "Otro", tone: "var(--eco-temp-soft)" },
];

export const ESTADOS: Meta[] = [
  { id: "nueva", label: "Nueva", tone: "var(--eco-humedad)" },
  { id: "en_revision", label: "En revisión", tone: "var(--eco-explosivos)" },
  { id: "hecha", label: "Hecha", tone: "var(--brand-accent)" },
  { id: "descartada", label: "Descartada", tone: "var(--eco-presion)" },
];

export const catMeta = (id: string): Meta =>
  CATEGORIAS.find((c) => c.id === id) ?? CATEGORIAS[CATEGORIAS.length - 1];

export const estadoMeta = (id: string): Meta =>
  ESTADOS.find((e) => e.id === id) ?? ESTADOS[0];
