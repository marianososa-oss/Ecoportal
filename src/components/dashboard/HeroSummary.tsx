import { CheckSquare, UserCircle, CalendarClock } from "lucide-react";

export function HeroSummary({
  perfilPct,
  tareasPendientes,
  eventosCount,
}: {
  perfilPct: number;
  tareasPendientes: number;
  eventosCount: number;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Chip icon={<CheckSquare size={15} />} valor={tareasPendientes} label={tareasPendientes === 1 ? "tarea pendiente" : "tareas pendientes"} />
      <Chip icon={<UserCircle size={15} />} valor={`${perfilPct}%`} label="perfil completo" />
      <Chip icon={<CalendarClock size={15} />} valor={eventosCount} label={eventosCount === 1 ? "evento próximo" : "eventos próximos"} />
    </div>
  );
}

function Chip({ icon, valor, label }: { icon: React.ReactNode; valor: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-md">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-brand-accent">{icon}</span>
      <div className="leading-tight">
        <p className="text-base font-extrabold text-white">{valor}</p>
        <p className="text-[11px] text-white/70">{label}</p>
      </div>
    </div>
  );
}
