"use client";

import { useState } from "react";
import { Check, Circle } from "lucide-react";

export type Tarea = {
  id: number;
  titulo: string;
  deadline: string;
  encargado: string;
  estado: "completa" | "pendiente" | "en-curso";
  destacada?: boolean;
};

const TABS = [
  { id: "todas", label: "Todas" },
  { id: "pendiente", label: "Sin completar" },
  { id: "completa", label: "Completas" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TaskTracker({ tareas }: { tareas: Tarea[] }) {
  const [tab, setTab] = useState<TabId>("todas");
  const [estado, setEstado] = useState<Record<number, Tarea["estado"]>>(
    Object.fromEntries(tareas.map((t) => [t.id, t.estado])),
  );

  const toggle = (id: number) =>
    setEstado((prev) => ({
      ...prev,
      [id]: prev[id] === "completa" ? "pendiente" : "completa",
    }));

  const visibles = tareas.filter((t) => {
    const e = estado[t.id];
    if (tab === "todas") return true;
    if (tab === "completa") return e === "completa";
    return e !== "completa";
  });

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-heading">Tareas</h2>
        <button className="text-xs font-semibold text-brand hover:text-brand-light">
          Ver todas
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 rounded-full bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              tab === t.id
                ? "bg-card text-brand shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <ul className="mt-4 space-y-1">
        {visibles.map((t) => {
          const done = estado[t.id] === "completa";
          const enCurso = estado[t.id] === "en-curso";
          return (
            <li key={t.id}>
              <div className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition hover:bg-surface">
                <button
                  onClick={() => toggle(t.id)}
                  className="mt-0.5 shrink-0"
                  aria-label={done ? "Marcar pendiente" : "Marcar completa"}
                >
                  {done ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-white">
                      <Check size={13} strokeWidth={3} />
                    </span>
                  ) : (
                    <Circle
                      size={20}
                      className="text-line transition hover:text-brand"
                    />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-semibold ${
                        done ? "text-muted line-through" : "text-ink"
                      }`}
                    >
                      {t.titulo}
                    </p>
                    {t.destacada && !done && (
                      <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-brand">
                        Hacé esto primero
                      </span>
                    )}
                    {enCurso && (
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-accent-dark">
                        En curso
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {t.deadline} · {t.encargado}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
        {visibles.length === 0 && (
          <li className="px-2 py-6 text-center text-sm text-muted">
            Nada por acá. ¡Bien ahí! 🎉
          </li>
        )}
      </ul>
    </section>
  );
}
