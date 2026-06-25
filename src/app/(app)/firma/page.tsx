import { SignatureGenerator } from "@/components/firma/SignatureGenerator";

export const metadata = { title: "Mi firma de mail" };

export default function FirmaPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <header className="max-w-2xl animate-rise">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Identidad
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Creá tu firma de mail
        </h1>
        <p className="mt-2 text-muted text-pretty">
          Completá tus datos, mirá la vista previa y copiala lista para pegar en
          Gmail.
        </p>
      </header>

      <div className="mt-8">
        <SignatureGenerator />
      </div>
    </div>
  );
}
