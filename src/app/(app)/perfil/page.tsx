import { ProfileImageGenerator } from "@/components/perfil/ProfileImageGenerator";

export const metadata = {
  title: "Mi imagen de perfil",
};

export default function PerfilPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <header className="max-w-2xl animate-rise">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Identidad
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Creá tu imagen de perfil
        </h1>
        <p className="mt-2 text-muted text-pretty">
          Escribí tu nombre y tu área, mirá la vista previa y descargá tu placa
          institucional de Ecocontrol.
        </p>
      </header>

      <div className="mt-8">
        <ProfileImageGenerator />
      </div>
    </div>
  );
}
