import { Sidebar } from "@/components/shell/Sidebar";
import { SiteFooter } from "@/components/SiteFooter";
import { getCurrentUser } from "@/lib/user";
import { toIdentidad } from "@/lib/identidad";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const identidad = user ? toIdentidad(user) : null;

  return (
    <>
      <Sidebar user={identidad} />
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
