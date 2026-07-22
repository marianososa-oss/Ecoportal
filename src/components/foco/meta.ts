import { HardHat, Code2, Building2, CircleDot } from "lucide-react";

/** Tipos de foco semanal, con etiqueta, color e ícono. */
export type TipoFoco = {
  id: string;
  label: string;
  tone: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export const TIPOS: TipoFoco[] = [
  { id: "obra", label: "En obra", tone: "var(--eco-monitoreo)", icon: HardHat },
  { id: "desarrollo", label: "Desarrollo", tone: "var(--eco-humedad)", icon: Code2 },
  { id: "oficina", label: "Oficina", tone: "var(--eco-aire)", icon: Building2 },
  { id: "otro", label: "Otro", tone: "var(--eco-temp-soft)", icon: CircleDot },
];

export const tipoMeta = (id: string): TipoFoco =>
  TIPOS.find((t) => t.id === id) ?? TIPOS[2];
