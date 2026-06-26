import { PageHero } from "@/components/shell/PageHero";
import { SignatureGenerator } from "@/components/firma/SignatureGenerator";
import { getCurrentUser } from "@/lib/user";
import { toIdentidad } from "@/lib/identidad";

export const metadata = { title: "Mi firma de mail" };
export const dynamic = "force-dynamic";

export default async function FirmaPage() {
  const user = await getCurrentUser();
  const id = user ? toIdentidad(user) : null;

  return (
    <>
      <PageHero
        eyebrow="Identidad"
        title="Creá tu firma de mail"
        subtitle="Completá tus datos, mirá la vista previa y copiala lista para pegar en Gmail."
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <SignatureGenerator
          initialNombre={id?.nombre ?? ""}
          initialArea={id?.area ?? ""}
          initialEmail={id?.email ?? ""}
        />
      </div>
    </>
  );
}
