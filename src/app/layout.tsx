import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { FlowField } from "@/components/FlowField";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Mi Portal · Ecocontrol",
    template: "%s · Mi Portal Ecocontrol",
  },
  description:
    "El espacio personal de cada persona de Ecocontrol: perfil, firma, agenda y novedades de tu área.",
  icons: { icon: "/logo-ecocontrol.svg" },
};

// Evita el parpadeo de tema: aplica la clase antes del primer render.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jost.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <FlowField />
        {children}
      </body>
    </html>
  );
}
