import { CalendarClock, CalendarCheck2, ArrowUpRight } from "lucide-react";
import type { CalEvent } from "@/lib/google";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const MES_ABBR = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const DIA_ABBR = ["dom","lun","mar","mié","jue","vie","sáb"];
const DOW = ["L", "M", "M", "J", "V", "S", "D"];

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

  // Días de ESTE mes con eventos, para marcarlos con un punto.
  const conEvento = new Set<number>();
  for (const e of eventos) {
    if (!e.inicio) continue;
    const d = new Date(e.inicio);
    if (d.getFullYear() === year && d.getMonth() === month) conEvento.add(d.getDate());
  }

  return (
    <div className="eco-card eco-card-hover p-5 md:p-6">
      <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
        {/* Mini calendario */}
        <div className="sm:w-64">
          <div className="flex items-center gap-2">
            <CalendarClock size={15} className="text-brand" />
            <h2 className="font-bold text-heading">
              {MESES[month][0].toUpperCase()}{MESES[month].slice(1)} {year}
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-0.5 text-center">
            {DOW.map((d, i) => (
              <span key={i} className="pb-1 text-[10px] font-bold uppercase text-muted">{d}</span>
            ))}
            {celdas.map((d, i) => (
              <div key={i} className="flex h-8 items-center justify-center">
                {d && (
                  <span
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full text-xs transition ${
                      d === today
                        ? "bg-brand font-bold text-white shadow-card"
                        : "text-ink hover:bg-surface"
                    }`}
                  >
                    {d}
                    {conEvento.has(d) && d !== today && (
                      <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-brand-accent" />
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Próximos eventos del Calendar */}
        <div className="border-t border-line pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-bold text-heading">
              <CalendarCheck2 size={14} className="text-brand-accent" /> Próximos eventos
            </p>
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-xs font-semibold text-brand hover:text-brand-light"
            >
              Abrir <ArrowUpRight size={12} />
            </a>
          </div>
          {eventos.length > 0 ? (
            <ul className="mt-3 space-y-2.5">
              {eventos.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{e.titulo}</p>
                    <p className="text-xs text-muted">{fmtEvento(e.inicio, e.todoElDia)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-6 text-center">
              <CalendarCheck2 size={20} className="text-muted" />
              <p className="text-xs text-muted">No tenés eventos próximos.</p>
              <p className="text-[11px] text-muted/80">Se sincroniza con tu Google Calendar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
