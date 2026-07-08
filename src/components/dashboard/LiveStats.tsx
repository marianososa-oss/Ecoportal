import { CheckCircle2, UserCircle } from "lucide-react";
import { ProgressBar } from "./Progress";

export function LiveStats({
  perfilPct,
  tareasTotal,
  tareasCompletas,
}: {
  perfilPct: number;
  tareasTotal: number;
  tareasCompletas: number;
}) {
  const pctTareas = tareasTotal ? Math.round((tareasCompletas / tareasTotal) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-5">
      <Stat icon={<CheckCircle2 size={16} />} titulo="Tareas completas" valor={`${tareasCompletas}/${tareasTotal}`} pct={pctTareas} />
      <Stat icon={<UserCircle size={16} />} titulo="Perfil completo" valor={`${perfilPct}%`} pct={perfilPct} />
    </div>
  );
}

function Stat({ icon, titulo, valor, pct }: { icon: React.ReactNode; titulo: string; valor: string; pct: number }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center gap-2 text-muted">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-brand">{icon}</span>
        <span className="text-xs font-semibold">{titulo}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-heading">{valor}</p>
      <div className="mt-2 flex items-center gap-2">
        <ProgressBar pct={pct} className="flex-1" />
        <span className="text-xs font-bold text-brand-accent-dark">{pct}%</span>
      </div>
    </div>
  );
}
