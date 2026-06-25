import { PageHero } from "@/components/shell/PageHero";
import { SignatureGenerator } from "@/components/firma/SignatureGenerator";

export const metadata = { title: "Mi firma de mail" };

export default function FirmaPage() {
  return (
    <>
      <PageHero
        eyebrow="Identidad"
        title="Creá tu firma de mail"
        subtitle="Completá tus datos, mirá la vista previa y copiala lista para pegar en Gmail."
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <SignatureGenerator />
      </div>
    </>
  );
}
