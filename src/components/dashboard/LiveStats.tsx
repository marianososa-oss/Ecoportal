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
      <Stat icon={<CheckCircle2 size={16} />} titulo="Tareas completas" valor={`${tareasCompletas}/${tareasTotal}`} pct={pctTareas} tone="var(--eco-aire)" />
      <Stat icon={<UserCircle size={16} />} titulo="Perfil completo" valor={`${perfilPct}%`} pct={perfilPct} tone="var(--eco-humedad)" />
    </div>
  );
}

function Stat({ icon, titulo, valor, pct, tone }: { icon: React.ReactNode; titulo: string; valor: string; pct: number; tone: string }) {
  return (
    <div className="eco-tile eco-card eco-card-hover p-4" style={{ ["--tone" as string]: tone }}>
      <div className="flex items-center gap-2 text-muted">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ color: "var(--tone)", background: "color-mix(in srgb, var(--tone) 14%, transparent)" }}
        >
          {icon}
        </span>
        <span className="text-xs font-semibold">{titulo}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-heading">{valor}</p>
      <div className="mt-2 flex items-center gap-2">
        <ProgressBar pct={pct} className="flex-1" tone={tone} />
        <span className="text-xs font-bold" style={{ color: "var(--tone)" }}>{pct}%</span>
      </div>
    </div>
  );
}
