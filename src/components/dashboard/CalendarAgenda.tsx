"use client";

import { useState } from "react";
import { CalendarClock, Info } from "lucide-react";

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DOW = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

export function CalendarAgenda() {
  const [info, setInfo] = useState(false);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // lunes = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const celdas: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock size={15} className="text-brand" />
          <h2 className="font-bold text-heading">
            Mi agenda · {MESES[month][0].toUpperCase()}{MESES[month].slice(1)}
          </h2>
        </div>
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

      <button
        onClick={() => setInfo((v) => !v)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand/5 py-2.5 text-xs font-bold text-brand transition hover:bg-brand/10"
      >
        <GoogleG /> Conectar Google Calendar
      </button>

      {info && (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-surface/70 px-3 py-2 text-[11px] leading-snug text-muted">
          <Info size={13} className="mt-0.5 shrink-0 text-brand" />
          Vas a poder ver tus eventos de Google Calendar acá apenas activemos el
          inicio de sesión con tu cuenta de Ecocontrol. ¡Ya falta poco!
        </p>
      )}
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
