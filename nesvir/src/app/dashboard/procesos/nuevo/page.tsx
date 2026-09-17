import { ProcesoForm } from "@/components/procesos/ProcesoForm";

export default function NuevoProcesoPage() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="mb-6 text-xl font-semibold text-foreground">Crear proceso</h1>
      <ProcesoForm />
    </div>
  );
}
