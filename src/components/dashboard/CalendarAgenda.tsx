import { CalendarClock, CalendarCheck2 } from "lucide-react";
import type { CalEvent } from "@/lib/google";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const MES_ABBR = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const DIA_ABBR = ["dom","lun","mar","mié","jue","vie","sáb"];
const DOW = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

function fmtEvento(inicio: string | null, todoElDia: boolean): string {
  if (!inicio) return "";
  const d = new Date(inicio);
  const fecha = `${DIA_ABBR[d.getDay()]} ${d.getDate()} ${MES_ABBR[d.getMonth()]}`;
  if (todoElDia) return fecha;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${fecha} · ${hh}:${mm}`;
}

export function CalendarAgenda({ eventos }: { eventos: CalEvent[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const celdas: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center gap-2">
        <CalendarClock size={15} className="text-brand" />
        <h2 className="font-bold text-heading">
          Mi agenda · {MESES[month][0].toUpperCase()}{MESES[month].slice(1)}
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {DOW.map((d) => (
          <span key={d} className="text-[10px] font-bold uppercase text-muted">{d}</span>
        ))}
        {celdas.map((d, i) => (
          <div key={i} className="flex aspect-square items-center justify-center">
            {d && (
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition ${
                  d === today ? "bg-brand font-bold text-white" : "text-ink hover:bg-surface"
                }`}
              >
                {d}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Próximos eventos de Google Calendar */}
      <div className="mt-4 border-t border-line pt-3">
        <p className="flex items-center gap-1.5 text-xs font-bold text-heading">
          <CalendarCheck2 size={13} className="text-brand-accent" /> Próximos eventos
        </p>
        {eventos.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {eventos.slice(0, 4).map((e) => (
              <li key={e.id} className="flex items-start gap-2 text-xs">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{e.titulo}</p>
                  <p className="text-[11px] text-muted">{fmtEvento(e.inicio, e.todoElDia)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[11px] leading-snug text-muted">
            No tenés eventos próximos en tu Google Calendar (o todavía no diste
            permiso). Se actualiza solo.
          </p>
        )}
      </div>
    </div>
  );
}
