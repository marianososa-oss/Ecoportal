import Link from "next/link";
import { cn } from "@/lib/utils";

/* El logo es un SVG con texto en verde/azul; en modo noche va sobre una
   pastilla blanca para mantener el contraste. */
export function Logo({
  className,
  height = 36,
  href = "/",
}: {
  className?: string;
  height?: number;
  href?: string | null;
}) {
  const img = (
    <span className="inline-flex rounded-md transition dark:bg-white dark:px-2 dark:py-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-ecocontrol.svg"
        alt="Ecocontrol"
        style={{ height }}
        className="w-auto"
      />
    </span>
  );

  if (href === null) return <span className={cn("inline-flex", className)}>{img}</span>;

  return (
    <Link href={href} className={cn("inline-flex shrink-0", className)}>
      {img}
    </Link>
  );
}
