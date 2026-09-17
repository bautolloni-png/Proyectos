"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Archivo, Enlace, Paso } from "@/lib/types/database";
import { finalizarPasos } from "@/lib/procesos/pasos";

export type ProcesoInput = {
  nombre: string;
  descripcion: string;
  objetivo: string;
  responsable: string;
  pasos: Paso[];
  archivos: Archivo[];
  videos: string[];
  enlaces: Enlace[];
  observaciones: string;
};

export type ProcesoActionState = { error: string | null };

export async function crearProceso(input: ProcesoInput): Promise<ProcesoActionState> {
  if (!input.nombre.trim()) {
    return { error: "El proceso necesita un nombre." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("empresa_id")
    .eq("id", user.id)
    .single();

  if (!usuario) {
    return { error: "No se encontró la empresa de tu usuario." };
  }

  const { data: proceso, error } = await supabase
    .from("procesos")
    .insert({
      empresa_id: usuario.empresa_id,
      creado_por: user.id,
      nombre: input.nombre.trim(),
      descripcion: input.descripcion,
      objetivo: input.objetivo,
      responsable: input.responsable,
      pasos: finalizarPasos(input.pasos),
      archivos: input.archivos,
      videos: input.videos,
      enlaces: input.enlaces,
      observaciones: input.observaciones,
    })
    .select("id")
    .single();

  if (error || !proceso) {
    return { error: error?.message ?? "No se pudo crear el proceso." };
  }

  redirect(`/dashboard/procesos/${proceso.id}`);
}
