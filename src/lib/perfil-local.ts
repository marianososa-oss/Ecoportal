"use client";

import { useCallback, useEffect, useState } from "react";

export type PerfilLocal = {
  nombre: string;
  apellido: string;
  area: string;
};

const KEY = "ecoportal-perfil";
const EVT = "ecoportal-perfil-change";
const VACIO: PerfilLocal = { nombre: "", apellido: "", area: "" };

function leer(): PerfilLocal {
  if (typeof window === "undefined") return VACIO;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return VACIO;
    return { ...VACIO, ...JSON.parse(raw) };
  } catch {
    return VACIO;
  }
}

/** % de perfil completo según los campos cargados. */
export function completitud(p: PerfilLocal): number {
  const campos = [p.nombre, p.apellido, p.area];
  const llenos = campos.filter((c) => c.trim()).length;
  return Math.round((llenos / campos.length) * 100);
}

/**
 * Hook del perfil personal guardado en el navegador (hasta que haya login).
 * Todos los componentes que lo usan se sincronizan al guardar.
 */
export function usePerfilLocal(): [PerfilLocal, (p: PerfilLocal) => void, boolean] {
  const [perfil, setPerfil] = useState<PerfilLocal>(VACIO);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setPerfil(leer());
    setListo(true);
    const sync = () => setPerfil(leer());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const guardar = useCallback((p: PerfilLocal) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {}
    window.dispatchEvent(new Event(EVT));
  }, []);

  return [perfil, guardar, listo];
}
