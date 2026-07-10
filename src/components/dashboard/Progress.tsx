"use client";

import { useEffect, useState } from "react";

/** Barra de progreso que crece de 0 a `pct` al montar. */
export function ProgressBar({
  pct,
  className = "",
  fill = "bg-brand-accent",
  track = "bg-surface",
  height = "h-1.5",
}: {
  pct: number;
  className?: string;
  fill?: string;
  track?: string;
  height?: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setW(pct));
    return () => cancelAnimationFrame(t);
  }, [pct]);

  return (
    <div className={`${height} overflow-hidden rounded-full ${track} ${className}`}>
      <div
        className={`h-full rounded-full ${fill} transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/** Anillo circular de progreso (se dibuja lleno por defecto; anima al cambiar). */
export function ProgressRing({
  pct,
  size = 64,
  stroke = 6,
  color = "var(--brand-accent)",
  trackColor = "rgba(255,255,255,.22)",
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, pct)) / 100) * c;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
      />
    </svg>
  );
}
