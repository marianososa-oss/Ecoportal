import { PageHero } from "@/components/shell/PageHero";
import { ProfileImageGenerator } from "@/components/perfil/ProfileImageGenerator";
import { getCurrentUser } from "@/lib/user";
import { toIdentidad } from "@/lib/identidad";

export const metadata = { title: "Mi imagen de perfil" };
export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const user = await getCurrentUser();
  const id = user ? toIdentidad(user) : null;

  return (
    <>
      <PageHero
        eyebrow="Identidad"
        title="Creá tu imagen de perfil"
        subtitle="Escribí tu nombre y tu área, mirá la vista previa y descargá tu placa institucional de Ecocontrol."
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <ProfileImageGenerator
          initialNombre={id?.nombre ?? ""}
          initialArea={id?.area ?? ""}
        />
      </div>
    </>
  );
}
