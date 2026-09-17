import Image from "next/image";
import Link from "next/link";
import type { Proceso, Usuario } from "@/lib/types/database";
import { logout } from "@/lib/actions/auth";
import { SidebarProcesoLink } from "./SidebarProcesoLink";

export function Sidebar({
  procesos,
  usuario,
}: {
  procesos: Pick<Proceso, "id" | "nombre" | "actualizado_en">[];
  usuario: Usuario | null;
}) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-navy text-white">
      <div className="px-5 pb-6 pt-6">
        <Image src="/logo-completo.png" alt="Nesvir" width={140} height={47} priority />
      </div>

      <div className="flex items-center justify-between px-5 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/50">
          Procesos
        </span>
        <Link
          href="/dashboard/procesos/nuevo"
          className="text-lg leading-none text-white/70 hover:text-white"
          aria-label="Crear proceso"
        >
          +
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        {procesos.length === 0 ? (
          <p className="px-3 py-2 text-sm text-white/40">Todavía no hay procesos.</p>
        ) : (
          <ul className="space-y-0.5">
            {procesos.map((proceso) => (
              <li key={proceso.id}>
                <SidebarProcesoLink
                  id={proceso.id}
                  nombre={proceso.nombre}
                  actualizadoEn={proceso.actualizado_en}
                />
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        {usuario && (
          <p className="truncate text-sm text-white/70">{usuario.nombre}</p>
        )}
        <form action={logout}>
          <button
            type="submit"
            className="mt-1 text-sm text-white/50 hover:text-white"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
