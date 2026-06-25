"use client";

import { useEffect, useRef, useState } from "react";

/** Barra de progreso que crece de 0 a `pct` al aparecer en pantalla. */
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          requestAnimationFrame(() => setW(pct));
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pct]);

  return (
    <div
      ref={ref}
      className={`${height} overflow-hidden rounded-full ${track} ${className}`}
    >
      <div
        className={`h-full rounded-full ${fill} transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/** Anillo circular de progreso que se "dibuja" al aparecer. */
export function ProgressRing({
  pct,
  size = 64,
  stroke = 6,
  color = "var(--brand-accent)",
  trackColor = "rgba(255,255,255,.25)",
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [offset, setOffset] = useState(c);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          requestAnimationFrame(() => setOffset(c - (pct / 100) * c));
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [c, pct]);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
    >
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
        className="transition-[stroke-dashoffset] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
      />
    </svg>
  );
}
