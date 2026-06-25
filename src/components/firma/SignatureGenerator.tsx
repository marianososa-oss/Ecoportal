"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check, Mail } from "lucide-react";
import { usePerfilLocal } from "@/lib/perfil-local";

/* Base pública para las imágenes (deben ser URLs absolutas para que carguen
   dentro del mail). Si más adelante hay dominio propio, se cambia acá. */
const SITE = "https://ecoportal-lime.vercel.app";

/* Datos corporativos fijos (iguales para todos). */
const FIJOS = {
  direccion: "25 de Mayo 3067 - (B7400DJQ) Olavarría, Buenos Aires, Argentina",
  tel: "0810-666-AIRE (2473) / 02284-415602",
  web: "www.ecocontrol.com.ar",
  webUrl: "https://www.ecocontrol.com.ar",
  linkedin: "Ecocontrol",
  linkedinUrl: "https://www.linkedin.com/company/ecocontrol",
  instagram: "@ecocontrol",
  instagramUrl: "https://www.instagram.com/ecocontrol",
};

type Datos = { nombre: string; area: string; email: string; cel: string };

function buildSignature(d: Datos): string {
  const nombre = d.nombre.trim() || "Nombre Apellido";
  const area = d.area.trim() || "Área";
  const email = d.email.trim() || "nombre.apellido@ecocontrol.com.ar";
  const cel = d.cel.trim();

  const gray = "#3f4a57";
  const blue = "#1768c4";
  const label = (t: string) => `<span style="color:#16314f;font-weight:bold">${t}</span>`;
  const link = (txt: string, href: string) =>
    `<a href="${href}" style="color:${blue};text-decoration:underline">${txt}</a>`;

  const celRow = cel
    ? `<tr><td style="padding:1px 0">${label("CEL:")} <span style="color:${gray}">${cel}</span></td></tr>`
    : "";

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:${gray}">
  <tr><td style="padding-bottom:2px;font-size:15px;font-weight:bold;color:#16314f">${nombre}</td></tr>
  <tr><td style="padding-bottom:8px;font-size:12px;font-weight:bold;color:${blue};text-transform:uppercase;letter-spacing:.3px">${area}</td></tr>
  <tr><td style="padding-bottom:8px"><img src="${SITE}/firma/logo.png" alt="Ecocontrol" width="230" style="display:block;width:230px;height:auto;border:0"></td></tr>
  <tr><td style="padding:1px 0;color:${gray}">${FIJOS.direccion}</td></tr>
  <tr><td style="padding:1px 0">${label("TE:")} <span style="color:${gray}">${FIJOS.tel}</span></td></tr>
  ${celRow}
  <tr><td style="padding:1px 0">${label("CORREO:")} ${link(email, `mailto:${email}`)}</td></tr>
  <tr><td style="padding:1px 0">${label("WEB:")} ${link(FIJOS.web, FIJOS.webUrl)}</td></tr>
  <tr><td style="padding:1px 0">${label("LinkedIn:")} ${link(FIJOS.linkedin, FIJOS.linkedinUrl)}</td></tr>
  <tr><td style="padding:1px 0 10px">${label("Instagram:")} ${link(FIJOS.instagram, FIJOS.instagramUrl)}</td></tr>
  <tr><td style="padding-bottom:8px"><img src="${SITE}/firma/banner.gif" alt="Ecocontrol" width="440" style="display:block;width:440px;max-width:100%;height:auto;border:0"></td></tr>
  <tr><td style="font-size:10px;font-style:italic;color:#4f7735">Por favor, no imprima este mensaje de no ser necesario. Ecocontrol se compromete con el cuidado del medio ambiente.</td></tr>
</table>`;
}

export function SignatureGenerator() {
  const [d, setD] = useState<Datos>({ nombre: "", area: "", email: "", cel: "" });
  const [copied, setCopied] = useState<"html" | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Prefill desde el perfil guardado (si ya lo cargaste en el tablero).
  const [perfil, , listoPerfil] = usePerfilLocal();
  const seeded = useRef(false);
  useEffect(() => {
    if (!listoPerfil || seeded.current) return;
    seeded.current = true;
    const full = `${perfil.nombre} ${perfil.apellido}`.trim();
    setD((p) => ({
      ...p,
      nombre: full || p.nombre,
      area: perfil.area.trim() || p.area,
    }));
  }, [listoPerfil, perfil]);

  const html = useMemo(() => buildSignature(d), [d]);

  const set = (k: keyof Datos) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setD((p) => ({ ...p, [k]: e.target.value }));

  async function copiar() {
    try {
      const blobHtml = new Blob([html], { type: "text/html" });
      const blobText = new Blob([previewRef.current?.innerText ?? ""], {
        type: "text/plain",
      });
      await navigator.clipboard.write([
        new ClipboardItem({ "text/html": blobHtml, "text/plain": blobText }),
      ]);
      setCopied("html");
      setTimeout(() => setCopied(null), 2200);
    } catch {
      // Fallback: seleccionar el nodo y copiar con execCommand.
      const node = previewRef.current;
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      try {
        document.execCommand("copy");
        setCopied("html");
        setTimeout(() => setCopied(null), 2200);
      } catch {}
      sel?.removeAllRanges();
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
      {/* Formulario */}
      <div className="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7">
        <h2 className="text-lg font-bold text-heading">Tus datos</h2>
        <p className="mt-1 text-sm text-muted">
          Completá tus datos. Lo demás (logo, dirección, teléfono general,
          redes y banner) ya viene cargado.
        </p>

        <Field label="Nombre y apellido" value={d.nombre} onChange={set("nombre")} placeholder="Mariano Sosa" />
        <Field label="Área" value={d.area} onChange={set("area")} placeholder="Marketing" />
        <Field label="Correo" type="email" value={d.email} onChange={set("email")} placeholder="mariano.sosa@ecocontrol.com.ar" />
        <Field label="Celular (opcional)" value={d.cel} onChange={set("cel")} placeholder="02284-717778" />

        <button
          type="button"
          onClick={copiar}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-light"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "¡Firma copiada!" : "Copiar firma"}
        </button>

        <div className="mt-6 rounded-xl border border-line bg-surface/60 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-heading">
            <Mail size={15} className="text-brand" /> Cómo ponerla en Gmail
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-muted">
            <li>Tocá <strong>Copiar firma</strong> acá arriba.</li>
            <li>En Gmail: ⚙️ → <strong>Ver toda la configuración</strong>.</li>
            <li>Bajá hasta <strong>Firma</strong> → <strong>Crear nueva</strong>.</li>
            <li>Pegá con <strong>Ctrl + V</strong> en el recuadro.</li>
            <li>Abajo, <strong>Guardar cambios</strong>. ¡Listo!</li>
          </ol>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-2xl border border-line bg-card p-4 shadow-card sm:p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Vista previa
        </p>
        <div className="overflow-x-auto rounded-xl bg-white p-5">
          <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <p className="mt-3 text-xs text-muted">
          Así se va a ver en tus mails. Las imágenes se cargan desde el portal.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="mt-4 block text-sm font-semibold text-ink">
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
      />
    </label>
  );
}
