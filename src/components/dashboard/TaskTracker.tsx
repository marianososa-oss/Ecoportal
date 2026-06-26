"use client";

import { useState } from "react";
import { Check, Circle, Plus, Trash2, Pencil, X } from "lucide-react";
import { useTareas } from "@/lib/tablero-local";

const TABS = [
  { id: "todas", label: "Todas" },
  { id: "pendiente", label: "Sin completar" },
  { id: "completa", label: "Completas" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function TaskTracker() {
  const { tareas, alternar, agregar, editar, borrar } = useTareas();
  const [tab, setTab] = useState<TabId>("todas");
  const [creando, setCreando] = useState(false);
  const [nuevo, setNuevo] = useState({ titulo: "", cuando: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editTxt, setEditTxt] = useState("");

  const visibles = tareas.filter((t) =>
    tab === "todas" ? true : tab === "completa" ? t.estado === "completa" : t.estado !== "completa",
  );

  const confirmarNueva = () => {
    if (!nuevo.titulo.trim()) return;
    agregar(nuevo.titulo, nuevo.cuando);
    setNuevo({ titulo: "", cuando: "" });
    setCreando(false);
  };

  const guardarEdit = () => {
    if (editId && editTxt.trim()) editar(editId, editTxt.trim());
    setEditId(null);
  };

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-heading">Tareas</h2>
        <button
          onClick={() => setCreando((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white transition hover:bg-brand-light"
        >
          <Plus size={13} /> Nueva
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 rounded-full bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              tab === t.id ? "bg-card text-brand shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Alta de tarea */}
      {creando && (
        <div className="mt-3 animate-rise rounded-xl border border-line bg-surface/60 p-3">
          <input
            autoFocus
            value={nuevo.titulo}
            onChange={(e) => setNuevo((n) => ({ ...n, titulo: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && confirmarNueva()}
            placeholder="¿Qué tenés que hacer?"
            className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
          <div className="mt-2 flex gap-2">
            <input
              value={nuevo.cuando}
              onChange={(e) => setNuevo((n) => ({ ...n, cuando: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && confirmarNueva()}
              placeholder="Cuándo (ej: Hoy 15:00)"
              className="flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-xs outline-none ring-brand/30 focus:ring-2"
            />
            <button
              onClick={confirmarNueva}
              className="rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-light"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <ul className="mt-4 space-y-1">
        {visibles.map((t) => {
          const done = t.estado === "completa";
          const editando = editId === t.id;
          return (
            <li key={t.id} className="group flex items-start gap-3 rounded-xl px-2 py-2.5 transition hover:bg-surface">
              <button onClick={() => alternar(t.id)} className="mt-0.5 shrink-0" aria-label="Completar">
                {done ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-white">
                    <Check size={13} strokeWidth={3} />
                  </span>
                ) : (
                  <Circle size={20} className="text-line transition hover:text-brand" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                {editando ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={editTxt}
                      onChange={(e) => setEditTxt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") guardarEdit();
                        if (e.key === "Escape") setEditId(null);
                      }}
                      className="w-full rounded-lg border border-line bg-bg px-2 py-1 text-sm outline-none ring-brand/30 focus:ring-2"
                    />
                    <button onClick={guardarEdit} className="text-brand" aria-label="Guardar">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditId(null)} className="text-muted" aria-label="Cancelar">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={`text-sm font-semibold ${done ? "text-muted line-through" : "text-ink"}`}>
                      {t.titulo}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{t.cuando}</p>
                  </>
                )}
              </div>

              {!editando && (
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setEditId(t.id);
                      setEditTxt(t.titulo);
                    }}
                    aria-label="Editar"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-card hover:text-brand"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => borrar(t.id)}
                    aria-label="Borrar"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-card hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </li>
          );
        })}
        {visibles.length === 0 && (
          <li className="px-2 py-6 text-center text-sm text-muted">
            {tab === "completa" ? "Todavía no completaste nada." : "Sin tareas. ¡Agregá una! 👆"}
          </li>
        )}
      </ul>
    </section>
  );
}
