"use client";

import { usePerfilLocal } from "@/lib/perfil-local";

export function Greeting({ fecha }: { fecha: string }) {
  const [perfil, , listo] = usePerfilLocal();
  const nombre = perfil.nombre.trim();

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        {listo && nombre ? `¡Hola, ${nombre}!` : "¡Hola!"} 👋
      </h1>
      <p className="mt-0.5 text-sm text-white/70">{fecha}</p>
    </div>
  );
}
