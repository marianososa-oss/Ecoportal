import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SignatureGenerator } from "@/components/firma/SignatureGenerator";

export const metadata = { title: "Mi firma de mail" };

export default function FirmaPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-brand"
          >
            <ArrowLeft size={15} /> Volver al inicio
          </Link>

          <header className="mt-5 animate-rise">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              Identidad
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
              Creá tu firma de mail
            </h1>
            <p className="mt-2 max-w-2xl text-muted">
              Completá tus datos, mirá la vista previa y copiala lista para
              pegar en Gmail.
            </p>
          </header>

          <div className="mt-8">
            <SignatureGenerator />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
