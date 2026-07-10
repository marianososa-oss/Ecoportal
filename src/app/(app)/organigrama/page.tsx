import { redirect } from "next/navigation";
import { Network, ArrowUpRight, Info } from "lucide-react";
import { getCurrentUser } from "@/lib/user";

export const metadata = { title: "Organigrama" };
export const dynamic = "force-dynamic";

const ORGANIGRAMA_URL =
  "https://script.google.com/a/macros/ecocontrol.com.ar/s/AKfycbxMuzaZYNhfaPqTEedHPN7ht1L23k4hmhu8uTD_WDYiE-dbPzhJjaqqEp97eUqlszMo/exec";

export default async function OrganigramaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Network size={18} />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-heading">Organigrama y perfiles</h1>
            <p className="text-xs text-muted">Estructura de Ecocontrol y fichas de puesto por área.</p>
          </div>
        </div>
        <a
          href={ORGANIGRAMA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-semibold text-brand shadow-card transition hover:bg-surface"
        >
          Pantalla completa <ArrowUpRight size={15} />
        </a>
      </div>

      {/* Vista embebida */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        <iframe
          src={ORGANIGRAMA_URL}
          title="Organigrama de Ecocontrol"
          className="h-[calc(100dvh-13rem)] min-h-[520px] w-full"
        />
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
        <Info size={14} className="mt-0.5 shrink-0 text-brand" />
        Si el organigrama no carga acá adentro, tu navegador puede estar pidiendo permiso de Google:
        abrilo con el botón <strong>“Pantalla completa”</strong> y va a andar igual.
      </p>
    </div>
  );
}
