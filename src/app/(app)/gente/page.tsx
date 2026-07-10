import Link from "next/link";
import { redirect } from "next/navigation";
import { Cake, Network, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shell/PageHero";
import { Directorio, type Persona } from "@/components/gente/Directorio";
import { Reconocimientos } from "@/components/gente/Reconocimientos";
import { getCurrentUser } from "@/lib/user";
import { getDirectorio, getCumpleaniosDelMes, getRecentKudos } from "@/db/queries";

export const metadata = { title: "Gente" };
export const dynamic = "force-dynamic";

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function nombreDe(u: { firstName: string; lastName: string; name: string; email: string }) {
  return `${u.firstName} ${u.lastName}`.trim() || u.name || u.email.split("@")[0];
}
function iniciales(nombre: string) {
  return nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default async function GentePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const now = new Date();
  const [todos, cumples, kudos] = await Promise.all([
    getDirectorio(),
    getCumpleaniosDelMes(now.getMonth() + 1),
    getRecentKudos(),
  ]);

  const opciones = todos
    .filter((u) => u.id !== user.id)
    .map((u) => ({ id: u.id, nombre: nombreDe(u) }));

  const personas: Persona[] = todos.map((u) => ({
    id: u.id,
    nombre: nombreDe(u),
    area: u.area,
    jobTitle: u.jobTitle,
    email: u.email,
    avatarUrl: u.avatarUrl,
    phone: u.phone,
  }));

  return (
    <>
      <PageHero
        eyebrow="Equipo"
        title="Gente de Ecocontrol"
        subtitle="Encontrá a cualquier compañero por nombre o área, y contactalo en un clic."
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Organigrama (vista embebida dentro del portal) */}
        <Link
          href="/organigrama"
          className="group mb-8 flex items-center gap-4 overflow-hidden rounded-2xl border border-brand/25 bg-gradient-to-br from-brand to-navy-2 p-5 text-white shadow-card transition-all duration-300 hover:shadow-lift sm:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Network size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold">Organigrama de Ecocontrol</p>
            <p className="text-sm text-white/80">Mirá la estructura de la empresa y quién es quién por área.</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand transition group-hover:bg-white/90">
            Ver <ArrowRight size={15} />
          </span>
        </Link>

        <Reconocimientos opciones={opciones} kudos={kudos} />

        {/* Cumpleaños del mes */}
        {cumples.length > 0 && (
          <section className="mb-8 rounded-2xl border border-line bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 font-bold text-heading">
              <Cake size={16} className="text-brand-accent" /> Cumpleaños de {MESES[now.getMonth()]}
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {cumples.map((u) => {
                const nombre = nombreDe(u);
                const dia = parseInt(u.birthday.slice(3), 10);
                return (
                  <div key={u.id} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface/50 px-3 py-2">
                    {u.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-white">
                        {iniciales(nombre)}
                      </span>
                    )}
                    <div className="leading-tight">
                      <p className="text-sm font-bold text-heading">{nombre}</p>
                      <p className="text-[11px] text-muted">{dia} de {MESES[now.getMonth()]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <Directorio personas={personas} />
      </div>
    </>
  );
}
