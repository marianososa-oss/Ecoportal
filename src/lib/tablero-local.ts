"use client";

import { useCallback, useEffect, useState } from "react";

/* Mini-store local (localStorage) para que el tablero sea editable de verdad
   antes de tener login + base. Se sincroniza entre componentes y pestañas. */

export type Tarea = {
  id: string;
  titulo: string;
  cuando: string;
  estado: "pendiente" | "completa";
};

export type TipoEvento = "capacitacion" | "cumple" | "evento";
export type Evento = {
  id: string;
  titulo: string;
  cuando: string;
  tipo: TipoEvento;
};

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const TAREAS_SEED: Tarea[] = [
  { id: uid(), titulo: "Conocé a tu equipo", cuando: "Hoy", estado: "completa" },
  { id: uid(), titulo: "Pedí tus accesos a Sistemas", cuando: "Hoy", estado: "pendiente" },
  { id: uid(), titulo: "Leé el manual de marca", cuando: "Esta semana", estado: "pendiente" },
];

const EVENTOS_SEED: Evento[] = [
  { id: uid(), titulo: "Capacitación: Cotizador CT01", cuando: "Hoy · 15:00", tipo: "capacitacion" },
  { id: uid(), titulo: "Cumple de Martín Fell", cuando: "Mañana", tipo: "cumple" },
  { id: uid(), titulo: "Reunión mensual de área", cuando: "Vie · 10:00", tipo: "evento" },
];

function useLista<T extends { id: string }>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>([]);
  const [listo, setListo] = useState(false);
  const evt = `ecoportal-${key}-change`;

  const leer = useCallback((): T[] => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        localStorage.setItem(key, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(raw);
    } catch {
      return seed;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    setItems(leer());
    setListo(true);
    const sync = () => setItems(leer());
    window.addEventListener(evt, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(evt, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persistir = useCallback(
    (next: T[]) => {
      setItems(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      window.dispatchEvent(new Event(evt));
    },
    [key, evt],
  );

  return { items, listo, persistir };
}

export function useTareas() {
  const { items, listo, persistir } = useLista<Tarea>("tareas", TAREAS_SEED);

  const agregar = (titulo: string, cuando: string) =>
    persistir([
      ...items,
      { id: uid(), titulo: titulo.trim(), cuando: cuando.trim() || "Sin fecha", estado: "pendiente" },
    ]);
  const alternar = (id: string) =>
    persistir(
      items.map((t) =>
        t.id === id
          ? { ...t, estado: t.estado === "completa" ? "pendiente" : "completa" }
          : t,
      ),
    );
  const editar = (id: string, titulo: string) =>
    persistir(items.map((t) => (t.id === id ? { ...t, titulo } : t)));
  const borrar = (id: string) => persistir(items.filter((t) => t.id !== id));

  return { tareas: items, listo, agregar, alternar, editar, borrar };
}

export function useEventos() {
  const { items, listo, persistir } = useLista<Evento>("eventos", EVENTOS_SEED);

  const agregar = (titulo: string, cuando: string, tipo: TipoEvento) =>
    persistir([
      ...items,
      { id: uid(), titulo: titulo.trim(), cuando: cuando.trim() || "Próximamente", tipo },
    ]);
  const borrar = (id: string) => persistir(items.filter((e) => e.id !== id));

  return { eventos: items, listo, agregar, borrar };
}
