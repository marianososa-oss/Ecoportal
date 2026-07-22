import { redirect } from "next/navigation";
import { PageHero } from "@/components/shell/PageHero";
import { SugerenciaForm } from "@/components/sugerencias/SugerenciaForm";
import { SuggestionsFeed } from "@/components/sugerencias/SuggestionsFeed";
import { getCurrentUser } from "@/lib/user";
import { getSuggestions } from "@/db/queries";

export const metadata = { title: "Sugerencias" };
export const dynamic = "force-dynamic";

export default async function SugerenciasPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const esAdmin = user.role === "rrhh" || user.role === "admin";
  const sugerencias = await getSuggestions(user.id);

  return (
    <>
      <PageHero
        eyebrow="Ideas"
        title="Sugerencias"
        subtitle="Contá qué necesitás para que el sistema y el día a día funcionen mejor. Las más apoyadas suben."
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <SugerenciaForm />
          </div>
          <SuggestionsFeed items={sugerencias} isAdmin={esAdmin} />
        </div>
      </div>
    </>
  );
}
