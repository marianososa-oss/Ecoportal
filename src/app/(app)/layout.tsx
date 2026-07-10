import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { SiteFooter } from "@/components/SiteFooter";
import { getCurrentUser } from "@/lib/user";
import { toIdentidad } from "@/lib/identidad";
import { getPendingRequests } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const identidad = user ? toIdentidad(user) : null;
  const esRRHH = user?.role === "rrhh" || user?.role === "admin";
  const pendingCount = esRRHH ? (await getPendingRequests()).length : 0;

  return (
    <>
      <Sidebar user={identidad} />
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <TopBar pendingCount={pendingCount} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
