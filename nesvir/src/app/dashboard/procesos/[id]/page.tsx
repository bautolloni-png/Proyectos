import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MermaidDiagram } from "@/components/procesos/MermaidDiagram";
import { VigenciaBadge } from "@/components/procesos/VigenciaBadge";
import { Collapsible } from "@/components/procesos/Collapsible";
import { pasosToMermaid } from "@/lib/procesos/mermaid";

export default async function ProcesoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proceso } = await supabase.from("procesos").select("*").eq("id", id).single();

  if (!proceso) {
    notFound();
  }

  const pasos = [...proceso.pasos].sort((a, b) => a.orden - b.orden);
  const chart = pasosToMermaid(pasos);

  const tieneDetalles =
    proceso.objetivo ||
    proceso.responsable ||
    proceso.archivos.length > 0 ||
    proceso.videos.length > 0 ||
    proceso.enlaces.length > 0 ||
    proceso.observaciones;

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground">{proceso.nombre}</h1>
        <VigenciaBadge actualizadoEn={proceso.actualizado_en} />
      </div>

      <div className="mb-8 rounded-lg border border-black/10 bg-black/[0.02] p-4">
        <MermaidDiagram chart={chart} />
      </div>

      {pasos.length === 0 ? (
        <p className="text-sm text-foreground/50">Este proceso todavía no tiene pasos.</p>
      ) : (
        <ol className="space-y-4">
          {pasos.map((paso, index) => (
            <li key={paso.id} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-light text-xs font-semibold text-navy">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-foreground">
                  {paso.tipo === "decision" ? paso.pregunta || paso.titulo : paso.titulo}
                </p>
                {paso.descripcion && (
                  <p className="mt-0.5 text-sm text-foreground/70">{paso.descripcion}</p>
                )}
                {paso.responsable && (
                  <p className="mt-0.5 text-xs text-foreground/50">
                    Responsable: {paso.responsable}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {tieneDetalles && (
        <div className="mt-10 border-t border-black/10 pt-6">
          <Collapsible label="Ver detalles adicionales">
            <div className="space-y-5">
              {proceso.objetivo && (
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    Objetivo
                  </h2>
                  <p className="mt-1 text-sm text-foreground/80">{proceso.objetivo}</p>
                </div>
              )}

              {proceso.responsable && (
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    Responsable general
                  </h2>
                  <p className="mt-1 text-sm text-foreground/80">{proceso.responsable}</p>
                </div>
              )}

              {proceso.archivos.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    Archivos
                  </h2>
                  <ul className="mt-1 space-y-1">
                    {proceso.archivos.map((archivo, i) => (
                      <li key={i}>
                        <a
                          href={archivo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          {archivo.nombre || archivo.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {proceso.videos.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    Videos
                  </h2>
                  <ul className="mt-1 space-y-1">
                    {proceso.videos.map((video, i) => (
                      <li key={i}>
                        <a
                          href={video}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          {video}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {proceso.enlaces.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    Enlaces
                  </h2>
                  <ul className="mt-1 space-y-1">
                    {proceso.enlaces.map((enlace, i) => (
                      <li key={i}>
                        <a
                          href={enlace.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          {enlace.titulo || enlace.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {proceso.observaciones && (
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    Observaciones
                  </h2>
                  <p className="mt-1 whitespace-pre-line text-sm text-foreground/80">
                    {proceso.observaciones}
                  </p>
                </div>
              )}
            </div>
          </Collapsible>
        </div>
      )}
    </div>
  );
}
