import { redirect } from "next/navigation";
import { CalendarRange } from "lucide-react";
import { PageHero } from "@/components/shell/PageHero";
import { MiFoco } from "@/components/foco/MiFoco";
import { FocoBoard } from "@/components/foco/FocoBoard";
import { getCurrentUser } from "@/lib/user";
import { getWorklogsByWeek, getMyWorklog } from "@/db/queries";
import { isoWeekKey, weekRangeLabel } from "@/lib/week";

export const metadata = { title: "En qué trabajamos" };
export const dynamic = "force-dynamic";

export default async function TrabajamosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const semana = isoWeekKey();
  const [items, mio] = await Promise.all([
    getWorklogsByWeek(semana),
    getMyWorklog(user.id, semana),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Equipo"
        title="En qué estamos trabajando"
        subtitle="Cada semana, en qué anda cada área. Para no pisarnos y saber quién está en obra."
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold text-muted">
          <CalendarRange size={14} className="text-brand" /> {weekRangeLabel()}
        </p>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
          <div className="lg:sticky lg:top-6">
            <MiFoco current={mio ? { tipo: mio.tipo, titulo: mio.titulo, lugar: mio.lugar } : null} />
          </div>
          <FocoBoard items={items} myUserId={user.id} />
        </div>
      </div>
    </>
  );
}
