"use client";

import { useMemo, useState } from "react";
import { Search, Mail, Phone, Users } from "lucide-react";

export type Persona = {
  id: number;
  nombre: string;
  area: string;
  jobTitle: string;
  email: string;
  avatarUrl: string;
  phone: string;
};

function iniciales(nombre: string) {
  return nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function Directorio({ personas }: { personas: Persona[] }) {
  const [q, setQ] = useState("");

  const grupos = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtradas = personas.filter(
      (p) =>
        !term ||
        p.nombre.toLowerCase().includes(term) ||
        p.area.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term),
    );
    const map = new Map<string, Persona[]>();
    for (const p of filtradas) {
      const area = p.area.trim() || "Sin área";
      if (!map.has(area)) map.set(area, []);
      map.get(area)!.push(p);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [personas, q]);

  const total = grupos.reduce((n, [, ps]) => n + ps.length, 0);

  return (
    <div>
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscá por nombre o área…"
          className="w-full rounded-full border border-line bg-card py-2.5 pl-10 pr-4 text-sm shadow-card outline-none ring-brand/30 transition focus:ring-2"
        />
      </div>

      {total === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line bg-card/60 py-14 text-center">
          <Users size={26} className="text-muted" />
          <p className="text-sm font-semibold text-heading">No encontramos a nadie</p>
          <p className="text-xs text-muted">Probá con otro nombre o área.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {grupos.map(([area, ps]) => (
            <section key={area}>
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand">
                {area}
                <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold text-muted">{ps.length}</span>
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ps.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 eco-card eco-card-hover p-4"
                  >
                    {p.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.avatarUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                        {iniciales(p.nombre)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-heading">{p.nombre}</p>
                      <p className="truncate text-xs text-muted">{p.jobTitle || p.area}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <a
                          href={`mailto:${p.email}`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-brand transition hover:bg-brand hover:text-white"
                          aria-label={`Escribir a ${p.nombre}`}
                          title={p.email}
                        >
                          <Mail size={13} />
                        </a>
                        {p.phone && (
                          <span className="flex items-center gap-1 text-[11px] text-muted">
                            <Phone size={11} /> {p.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
