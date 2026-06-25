import { Sidebar } from "@/components/shell/Sidebar";
import { SiteFooter } from "@/components/SiteFooter";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
