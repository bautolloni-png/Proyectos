"use client";

import type { Paso } from "@/lib/types/database";
import { crearPasoVacio } from "@/lib/procesos/pasos";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-accent";

export function StepEditor({
  pasos,
  onChange,
}: {
  pasos: Paso[];
  onChange: (pasos: Paso[]) => void;
}) {
  function updatePaso(index: number, patch: Partial<Paso>) {
    onChange(pasos.map((paso, i) => (i === index ? { ...paso, ...patch } : paso)));
  }

  function addPaso() {
    onChange([...pasos, crearPasoVacio()]);
  }

  function removePaso(index: number) {
    const removedId = pasos[index].id;
    const rest = pasos.filter((_, i) => i !== index);
    onChange(
      rest.map((paso) => ({
        ...paso,
        rama_si: paso.rama_si === removedId ? null : paso.rama_si,
        rama_no: paso.rama_no === removedId ? null : paso.rama_no,
      })),
    );
  }

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= pasos.length) return;
    const next = [...pasos];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {pasos.map((paso, index) => (
        <StepCard
          key={paso.id}
          paso={paso}
          index={index}
          total={pasos.length}
          otrosPasos={pasos.filter((p) => p.id !== paso.id)}
          onUpdate={(patch) => updatePaso(index, patch)}
          onRemove={() => removePaso(index)}
          onMove={(direction) => moveStep(index, direction)}
        />
      ))}

      <button
        type="button"
        onClick={addPaso}
        className="w-full rounded-lg border border-dashed border-black/15 py-2.5 text-sm font-medium text-foreground/60 hover:border-accent hover:text-accent"
      >
        + Agregar paso
      </button>
    </div>
  );
}

function StepCard({
  paso,
  index,
  total,
  otrosPasos,
  onUpdate,
  onRemove,
  onMove,
}: {
  paso: Paso;
  index: number;
  total: number;
  otrosPasos: Paso[];
  onUpdate: (patch: Partial<Paso>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  function addChecklistItem() {
    onUpdate({ checklist: [...paso.checklist, { texto: "", completado: false }] });
  }

  function updateChecklistItem(itemIndex: number, texto: string) {
    onUpdate({
      checklist: paso.checklist.map((item, i) =>
        i === itemIndex ? { ...item, texto } : item,
      ),
    });
  }

  function removeChecklistItem(itemIndex: number) {
    onUpdate({ checklist: paso.checklist.filter((_, i) => i !== itemIndex) });
  }

  return (
    <div className="rounded-lg border border-black/10 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground/70">Paso {index + 1}</span>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-md border border-black/10 text-xs">
            <button
              type="button"
              onClick={() => onUpdate({ tipo: "accion" })}
              className={`px-2.5 py-1 ${
                paso.tipo === "accion" ? "bg-accent text-white" : "text-foreground/60"
              }`}
            >
              Acción
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ tipo: "decision" })}
              className={`px-2.5 py-1 ${
                paso.tipo === "decision" ? "bg-accent text-white" : "text-foreground/60"
              }`}
            >
              Decisión
            </button>
          </div>

          <div className="flex items-center gap-1 text-foreground/40">
            <button
              type="button"
              onClick={() => onMove(-1)}
              disabled={index === 0}
              className="disabled:opacity-30"
              aria-label="Mover arriba"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMove(1)}
              disabled={index === total - 1}
              className="disabled:opacity-30"
              aria-label="Mover abajo"
            >
              ↓
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="text-foreground/40 hover:text-red-600"
            aria-label="Eliminar paso"
          >
            ×
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <input
          value={paso.titulo}
          onChange={(e) => onUpdate({ titulo: e.target.value })}
          placeholder={paso.tipo === "decision" ? "Nombre corto de la decisión" : "Título del paso"}
          className={inputClass}
        />

        {paso.tipo === "decision" && (
          <input
            value={paso.pregunta ?? ""}
            onChange={(e) => onUpdate({ pregunta: e.target.value })}
            placeholder="¿Cuál es la pregunta? (ej: ¿El cliente aprobó el presupuesto?)"
            className={inputClass}
          />
        )}

        <textarea
          value={paso.descripcion}
          onChange={(e) => onUpdate({ descripcion: e.target.value })}
          placeholder="Descripción"
          rows={2}
          className={inputClass}
        />

        <input
          value={paso.responsable}
          onChange={(e) => onUpdate({ responsable: e.target.value })}
          placeholder="Responsable"
          className={inputClass}
        />

        {paso.tipo === "decision" && (
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-xs text-foreground/60">
              Si es &ldquo;Sí&rdquo; →
              <select
                value={paso.rama_si ?? ""}
                onChange={(e) => onUpdate({ rama_si: e.target.value || null })}
                className={inputClass}
              >
                <option value="">— Fin del proceso —</option>
                {otrosPasos.map((p, i) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo || `Paso sin título (${i + 1})`}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-xs text-foreground/60">
              Si es &ldquo;No&rdquo; →
              <select
                value={paso.rama_no ?? ""}
                onChange={(e) => onUpdate({ rama_no: e.target.value || null })}
                className={inputClass}
              >
                <option value="">— Fin del proceso —</option>
                {otrosPasos.map((p, i) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo || `Paso sin título (${i + 1})`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="space-y-1.5">
          {paso.checklist.map((item, itemIndex) => (
            <div key={itemIndex} className="flex items-center gap-2">
              <input
                value={item.texto}
                onChange={(e) => updateChecklistItem(itemIndex, e.target.value)}
                placeholder="Ítem de checklist"
                className={`${inputClass} py-1.5`}
              />
              <button
                type="button"
                onClick={() => removeChecklistItem(itemIndex)}
                className="text-foreground/40 hover:text-red-600"
                aria-label="Eliminar ítem"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addChecklistItem}
            className="text-xs font-medium text-accent hover:underline"
          >
            + Agregar ítem de checklist
          </button>
        </div>
      </div>
    </div>
  );
}
