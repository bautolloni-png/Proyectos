"use client";

import { useMemo, useState, useTransition } from "react";
import type { Archivo, Enlace, Paso } from "@/lib/types/database";
import { crearProceso } from "@/lib/actions/procesos";
import { pasosToMermaid } from "@/lib/procesos/mermaid";
import { StepEditor } from "./StepEditor";
import { Collapsible } from "./Collapsible";
import { MermaidDiagram } from "./MermaidDiagram";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-accent";

export function ProcesoForm() {
  const [nombre, setNombre] = useState("");
  const [pasos, setPasos] = useState<Paso[]>([]);
  const [descripcion, setDescripcion] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [responsable, setResponsable] = useState("");
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [enlaces, setEnlaces] = useState<Enlace[]>([]);
  const [observaciones, setObservaciones] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const chart = useMemo(() => pasosToMermaid(pasos), [pasos]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await crearProceso({
        nombre,
        descripcion,
        objetivo,
        responsable,
        pasos,
        archivos,
        videos,
        enlaces,
        observaciones,
      });
      if (result.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div>
          <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-foreground">
            Nombre del proceso
          </label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Onboarding de clientes nuevos"
            required
            className={inputClass}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-foreground">Pasos</span>
          <StepEditor pasos={pasos} onChange={setPasos} />
        </div>

        <Collapsible label="Agregar más detalles">
          <div className="space-y-4 rounded-lg border border-black/10 p-4">
            <div>
              <label className="mb-1 block text-xs text-foreground/60">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={2}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-foreground/60">Objetivo</label>
              <textarea
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                rows={2}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-foreground/60">
                Responsable general
              </label>
              <input
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                className={inputClass}
              />
            </div>

            <ArchivosEditor archivos={archivos} onChange={setArchivos} />
            <VideosEditor videos={videos} onChange={setVideos} />
            <EnlacesEditor enlaces={enlaces} onChange={setEnlaces} />

            <div>
              <label className="mb-1 block text-xs text-foreground/60">Observaciones</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </Collapsible>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Creando…" : "Crear proceso"}
        </button>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <span className="mb-2 block text-sm font-medium text-foreground">
          Vista previa del diagrama
        </span>
        <div className="rounded-lg border border-black/10 bg-black/[0.02] p-4">
          <MermaidDiagram chart={chart} />
        </div>
      </div>
    </form>
  );
}

function ArchivosEditor({
  archivos,
  onChange,
}: {
  archivos: Archivo[];
  onChange: (archivos: Archivo[]) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-foreground/60">Archivos</label>
      <div className="space-y-2">
        {archivos.map((archivo, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={archivo.nombre}
              onChange={(e) =>
                onChange(
                  archivos.map((a, j) => (j === i ? { ...a, nombre: e.target.value } : a)),
                )
              }
              placeholder="Nombre"
              className={`${inputClass} py-1.5`}
            />
            <input
              value={archivo.url}
              onChange={(e) =>
                onChange(archivos.map((a, j) => (j === i ? { ...a, url: e.target.value } : a)))
              }
              placeholder="URL"
              className={`${inputClass} py-1.5`}
            />
            <button
              type="button"
              onClick={() => onChange(archivos.filter((_, j) => j !== i))}
              className="text-foreground/40 hover:text-red-600"
              aria-label="Eliminar archivo"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...archivos, { nombre: "", url: "" }])}
          className="text-xs font-medium text-accent hover:underline"
        >
          + Agregar archivo
        </button>
      </div>
    </div>
  );
}

function VideosEditor({
  videos,
  onChange,
}: {
  videos: string[];
  onChange: (videos: string[]) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-foreground/60">Videos (links)</label>
      <div className="space-y-2">
        {videos.map((url, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={url}
              onChange={(e) => onChange(videos.map((v, j) => (j === i ? e.target.value : v)))}
              placeholder="https://..."
              className={`${inputClass} py-1.5`}
            />
            <button
              type="button"
              onClick={() => onChange(videos.filter((_, j) => j !== i))}
              className="text-foreground/40 hover:text-red-600"
              aria-label="Eliminar video"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...videos, ""])}
          className="text-xs font-medium text-accent hover:underline"
        >
          + Agregar video
        </button>
      </div>
    </div>
  );
}

function EnlacesEditor({
  enlaces,
  onChange,
}: {
  enlaces: Enlace[];
  onChange: (enlaces: Enlace[]) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-foreground/60">Enlaces</label>
      <div className="space-y-2">
        {enlaces.map((enlace, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={enlace.titulo}
              onChange={(e) =>
                onChange(
                  enlaces.map((en, j) => (j === i ? { ...en, titulo: e.target.value } : en)),
                )
              }
              placeholder="Título"
              className={`${inputClass} py-1.5`}
            />
            <input
              value={enlace.url}
              onChange={(e) =>
                onChange(enlaces.map((en, j) => (j === i ? { ...en, url: e.target.value } : en)))
              }
              placeholder="URL"
              className={`${inputClass} py-1.5`}
            />
            <button
              type="button"
              onClick={() => onChange(enlaces.filter((_, j) => j !== i))}
              className="text-foreground/40 hover:text-red-600"
              aria-label="Eliminar enlace"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...enlaces, { titulo: "", url: "" }])}
          className="text-xs font-medium text-accent hover:underline"
        >
          + Agregar enlace
        </button>
      </div>
    </div>
  );
}
