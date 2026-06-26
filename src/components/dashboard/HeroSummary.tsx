"use client";

import { CheckSquare, UserCircle, CalendarClock } from "lucide-react";
import { useTareas, useEventos } from "@/lib/tablero-local";
import { usePerfilLocal, completitud } from "@/lib/perfil-local";

export function HeroSummary() {
  const { tareas } = useTareas();
  const { eventos } = useEventos();
  const [perfil] = usePerfilLocal();

  const pendientes = tareas.filter((t) => t.estado !== "completa").length;
  const pct = completitud(perfil);

  return (
    <div className="flex flex-wrap gap-2.5">
      <Chip icon={<CheckSquare size={15} />} valor={pendientes} label={pendientes === 1 ? "tarea pendiente" : "tareas pendientes"} />
      <Chip icon={<UserCircle size={15} />} valor={`${pct}%`} label="perfil completo" />
      <Chip icon={<CalendarClock size={15} />} valor={eventos.length} label={eventos.length === 1 ? "evento próximo" : "eventos próximos"} />
    </div>
  );
}

function Chip({
  icon,
  valor,
  label,
}: {
  icon: React.ReactNode;
  valor: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-md">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-brand-accent">
        {icon}
      </span>
      <div className="leading-tight">
        <p className="text-base font-extrabold text-white">{valor}</p>
        <p className="text-[11px] text-white/70">{label}</p>
      </div>
    </div>
  );
}
