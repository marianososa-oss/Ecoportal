import { redirect } from "next/navigation";
import { ArrowUpRight, Info } from "lucide-react";
import { PageHero } from "@/components/shell/PageHero";
import { getCurrentUser } from "@/lib/user";

export const metadata = { title: "Organigrama" };
export const dynamic = "force-dynamic";

const ORGANIGRAMA_URL =
  "https://script.google.com/a/macros/ecocontrol.com.ar/s/AKfycbxMuzaZYNhfaPqTEedHPN7ht1L23k4hmhu8uTD_WDYiE-dbPzhJjaqqEp97eUqlszMo/exec";

export default async function OrganigramaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <PageHero
        eyebrow="Equipo"
        title="Organigrama y perfiles"
        subtitle="La estructura de Ecocontrol y las fichas de puesto de cada área."
      >
        <a
          href={ORGANIGRAMA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-white/90"
        >
          Abrir en pantalla completa <ArrowUpRight size={15} />
        </a>
      </PageHero>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="eco-sheen overflow-hidden eco-card">
          <iframe
            src={ORGANIGRAMA_URL}
            title="Organigrama de Ecocontrol"
            className="h-[calc(100dvh-16rem)] min-h-[520px] w-full"
          />
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
          <Info size={14} className="mt-0.5 shrink-0 text-brand" />
          Si el organigrama no carga acá adentro, tu navegador puede estar pidiendo
          permiso de Google: abrilo con el botón <strong>“Abrir en pantalla completa”</strong>.
        </p>
      </div>
    </>
  );
}
