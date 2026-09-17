import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: usuario } = user
    ? await supabase.from("usuarios").select("*").eq("id", user.id).single()
    : { data: null };

  const { data: procesos } = await supabase
    .from("procesos")
    .select("id, nombre, descripcion, pasos, actualizado_en")
    .order("nombre");

  const listaProcesos = procesos ?? [];

  return (
    <div className="flex min-h-screen">
      <Sidebar procesos={listaProcesos} usuario={usuario} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          procesos={listaProcesos.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            pasos: p.pasos.map((paso) => ({
              titulo: paso.titulo,
              descripcion: paso.descripcion,
            })),
          }))}
        />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
