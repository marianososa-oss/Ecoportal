import { redirect } from "next/navigation";
import { PageHero } from "@/components/shell/PageHero";
import { TourGuiado } from "@/components/tour/TourGuiado";
import { getCurrentUser } from "@/lib/user";
import { toIdentidad } from "@/lib/identidad";

export const metadata = { title: "Tour guiado" };
export const dynamic = "force-dynamic";

export default async function TourPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const identidad = toIdentidad(user);

  return (
    <>
      <PageHero
        eyebrow="Inducción"
        title="Conocé tu portal en 2 minutos"
        subtitle="Un recorrido por cada sección, para que sepas dónde está todo desde el primer día."
      />

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <TourGuiado
          nombre={identidad.firstName || identidad.nombre}
          yaHecho={user.tourDone}
        />
      </div>
    </>
  );
}
