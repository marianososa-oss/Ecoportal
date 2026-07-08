import { redirect } from "next/navigation";

// "Mi tablero" se fusionó con Inicio en "Mi día" (/).
export default function DashboardRedirect() {
  redirect("/");
}
