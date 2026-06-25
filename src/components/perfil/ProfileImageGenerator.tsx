"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Download, RefreshCw } from "lucide-react";
import { usePerfilLocal } from "@/lib/perfil-local";

/* La plantilla es 800×800. Estas constantes ubican el texto dentro del panel
   celeste del medio. Son fáciles de ajustar si hace falta correr algo. */
const SIZE = 800;
const CENTER_X = SIZE / 2;
const NAME = { cy: 452, font: 40, min: 22, maxW: 430, spacing: 1 };
const AREA = { cy: 491, font: 22, min: 14, maxW: 430, spacing: 2 };

const AREAS_SUGERIDAS = [
  "Marketing",
  "Ingeniería",
  "Comercial",
  "Administración",
  "RRHH",
  "Operaciones",
  "Compras",
  "Calidad",
  "Sistemas",
  "Logística",
];

/** Devuelve el nombre de familia que next/font generó para Jost. */
function jostFamily(): string {
  if (typeof window === "undefined") return "sans-serif";
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-jost")
    .trim();
  return v ? `${v}, system-ui, sans-serif` : "system-ui, sans-serif";
}

/** Ajusta el tamaño de fuente para que el texto entre en maxW. */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  base: number,
  min: number,
  maxW: number,
  family: string,
) {
  let size = base;
  do {
    ctx.font = `700 ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxW) break;
    size -= 1;
  } while (size > min);
  return size;
}

export function ProfileImageGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const [nombre, setNombre] = useState("");
  const [area, setArea] = useState("");

  // Prefill desde el perfil guardado (si ya lo cargaste en el tablero).
  const [perfil, , listoPerfil] = usePerfilLocal();
  const seeded = useRef(false);
  useEffect(() => {
    if (!listoPerfil || seeded.current) return;
    seeded.current = true;
    const full = `${perfil.nombre} ${perfil.apellido}`.trim();
    if (full) setNombre(full);
    if (perfil.area.trim()) setArea(perfil.area);
  }, [listoPerfil, perfil]);

  // Carga la plantilla y las fuentes una sola vez.
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        await document.fonts.ready;
      } catch {}
      if (!alive) return;
      imgRef.current = img;
      setReady(true);
    };
    img.src = "/perfil/plantilla.png";
    return () => {
      alive = false;
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const family = jostFamily();
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.drawImage(img, 0, 0, SIZE, SIZE);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Nombre y apellido
    const nom = nombre.trim().toUpperCase() || "TU NOMBRE";
    const nSize = fitFont(ctx, nom, NAME.font, NAME.min, NAME.maxW, family);
    ctx.font = `700 ${nSize}px ${family}`;
    ctx.fillStyle = nombre.trim() ? "#ffffff" : "rgba(255,255,255,0.45)";
    ctx.letterSpacing = `${NAME.spacing}px`;
    ctx.fillText(nom, CENTER_X, NAME.cy);

    // Área
    const ar = area.trim().toUpperCase() || "TU ÁREA";
    const aSize = fitFont(ctx, ar, AREA.font, AREA.min, AREA.maxW, family);
    ctx.font = `700 ${aSize}px ${family}`;
    ctx.fillStyle = area.trim()
      ? "rgba(255,255,255,0.92)"
      : "rgba(255,255,255,0.4)";
    ctx.letterSpacing = `${AREA.spacing}px`;
    ctx.fillText(ar, CENTER_X, AREA.cy);

    ctx.letterSpacing = "0px";
  }, [nombre, area]);

  useEffect(() => {
    if (ready) draw();
  }, [ready, draw]);

  const descargar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const base = nombre.trim()
        ? nombre.trim().toLowerCase().replace(/\s+/g, "-")
        : "perfil";
      a.href = url;
      a.download = `ecocontrol-${base}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const limpiar = () => {
    setNombre("");
    setArea("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      {/* Formulario */}
      <div className="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7">
        <h2 className="text-lg font-bold text-heading">Tus datos</h2>
        <p className="mt-1 text-sm text-muted">
          Completá tu nombre y tu área. La imagen se actualiza al instante.
        </p>

        <label className="mt-6 block text-sm font-semibold text-ink">
          Nombre y apellido
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Mariano Sosa"
            maxLength={34}
            className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-ink">
          Área
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Ej: Marketing"
            list="areas-sugeridas"
            maxLength={28}
            className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
          />
          <datalist id="areas-sugeridas">
            {AREAS_SUGERIDAS.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </label>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={descargar}
            disabled={!ready}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-light disabled:opacity-50"
          >
            <Download size={16} /> Descargar PNG
          </button>
          <button
            type="button"
            onClick={limpiar}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-muted transition hover:bg-surface hover:text-brand"
          >
            <RefreshCw size={15} /> Limpiar
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-2xl border border-line bg-card p-4 shadow-card sm:p-6">
        <div className="overflow-hidden rounded-xl">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="block h-auto w-full"
          />
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          {ready
            ? "Vista previa en tiempo real · 800×800 px"
            : "Cargando plantilla…"}
        </p>
      </div>
    </div>
  );
}
