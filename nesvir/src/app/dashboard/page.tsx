import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-lg font-semibold text-foreground">
        Todavía no tenés procesos documentados
      </h1>
      <p className="mt-2 max-w-sm text-sm text-foreground/60">
        Un proceso guarda los pasos, archivos y videos que hoy solo tiene una
        persona en la cabeza.
      </p>
      <Link
        href="/dashboard/procesos/nuevo"
        className="mt-6 rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
      >
        Crear tu primer proceso
      </Link>
    </div>
  );
}
