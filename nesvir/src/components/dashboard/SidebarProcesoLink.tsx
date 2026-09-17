"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getVigencia } from "@/lib/procesos/vigencia";

const DOT_CLASSES = {
  reciente: "bg-accent-light",
  media: "bg-white/40",
  antigua: "bg-amber-300",
};

export function SidebarProcesoLink({
  id,
  nombre,
  actualizadoEn,
}: {
  id: string;
  nombre: string;
  actualizadoEn: string;
}) {
  const pathname = usePathname();
  const href = `/dashboard/procesos/${id}`;
  const isActive = pathname === href;
  const { tier, label } = getVigencia(actualizadoEn);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 truncate rounded-md px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-accent text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASSES[tier]}`}
        title={label}
      />
      <span className="truncate">{nombre}</span>
    </Link>
  );
}
