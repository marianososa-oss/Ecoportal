"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo animado tipo "corrientes de aire" (temática HVAC/termomecánica).
 * Canvas a pantalla completa, detrás de todo el contenido. Sutil y liviano.
 */
export function FlowField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = getComputedStyle(document.documentElement);
    const brand = root.getPropertyValue("--brand").trim() || "#0b56b0";
    const accent = root.getPropertyValue("--brand-accent").trim() || "#4f7735";

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = Math.min(140, Math.floor((w * h) / 12000));
    type P = { x: number; y: number; px: number; py: number; c: string; s: number };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      px: 0,
      py: 0,
      c: Math.random() < 0.78 ? brand : accent,
      s: rand(0.4, 1.1),
    }));

    const field = (x: number, y: number, t: number) => {
      const a =
        Math.sin(x * 0.0016 + t) * 1.3 +
        Math.cos(y * 0.0019 - t * 0.8) * 1.3 +
        Math.sin((x + y) * 0.001 + t * 0.5);
      return a * Math.PI;
    };

    let t = 0;
    let raf = 0;
    const speed = 0.55;

    const tick = () => {
      t += 0.0016;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.px = p.x;
        p.py = p.y;
        const ang = field(p.x, p.y, t);
        p.x += Math.cos(ang) * speed;
        p.y += Math.sin(ang) * speed;
        if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          p.x = rand(0, w);
          p.y = rand(0, h);
          p.px = p.x;
          p.py = p.y;
        }
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.c;
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = p.s;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
