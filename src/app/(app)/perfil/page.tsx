import { PageHero } from "@/components/shell/PageHero";
import { ProfileImageGenerator } from "@/components/perfil/ProfileImageGenerator";

export const metadata = {
  title: "Mi imagen de perfil",
};

export default function PerfilPage() {
  return (
    <>
      <PageHero
        eyebrow="Identidad"
        title="Creá tu imagen de perfil"
        subtitle="Escribí tu nombre y tu área, mirá la vista previa y descargá tu placa institucional de Ecocontrol."
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <ProfileImageGenerator />
      </div>
    </>
  );
}
