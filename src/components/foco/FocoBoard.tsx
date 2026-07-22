import { MapPin, Users } from "lucide-react";
import { tipoMeta } from "./meta";
import type { WorklogView } from "@/db/queries";

function iniciales(nombre: string) {
  return nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function FocoBoard({ items, myUserId }: { items: WorklogView[]; myUserId: number }) {
  if (items.length === 0) {
    return (
      <div className="eco-card flex flex-col items-center gap-2 p-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-brand">
          <Users size={22} />
        </span>
        <p className="text-sm font-semibold text-heading">Nadie publicó su foco todavía</p>
        <p className="max-w-xs text-xs text-muted">Sé la primera persona: contá arriba en qué estás trabajando esta semana.</p>
      </div>
    );
  }

  // Agrupar por área conservando el orden (ya viene ordenado por área/nombre).
  const areas: { area: string; entries: WorklogView[] }[] = [];
  for (const w of items) {
    let g = areas.find((a) => a.area === w.area);
    if (!g) {
      g = { area: w.area, entries: [] };
      areas.push(g);
    }
    g.entries.push(w);
  }

  return (
    <div className="space-y-5">
      {areas.map((g) => (
        <section key={g.area} className="eco-card p-5">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-brand" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-heading">{g.area}</h3>
            <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold text-muted">{g.entries.length}</span>
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {g.entries.map((w) => {
              const t = tipoMeta(w.tipo);
              const Icon = t.icon;
              const mine = w.userId === myUserId;
              return (
                <li
                  key={w.id}
                  className="flex gap-3 rounded-xl border border-line bg-surface/40 p-3.5"
                  style={mine ? { borderColor: "color-mix(in srgb, var(--brand) 45%, transparent)" } : undefined}
                >
                  {w.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                      {iniciales(w.autor)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-heading">{w.autor}</p>
                      {mine && <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-brand">vos</span>}
                    </div>
                    <span
                      className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                      style={{ color: t.tone, background: `color-mix(in srgb, ${t.tone} 15%, transparent)` }}
                    >
                      <Icon size={11} /> {t.label}
                    </span>
                    <p className="mt-1.5 text-sm text-ink">{w.titulo}</p>
                    {w.lugar && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                        <MapPin size={12} /> {w.lugar}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
