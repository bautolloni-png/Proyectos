import type { Paso } from "@/lib/types/database";

function nodeId(pasoId: string): string {
  return `n${pasoId.replace(/[^a-zA-Z0-9]/g, "")}`;
}

function escapeLabel(text: string): string {
  return text.replace(/"/g, "'").replace(/\n/g, " ").trim() || "Sin título";
}

export function pasosToMermaid(pasos: Paso[]): string {
  if (pasos.length === 0) {
    return 'flowchart TD\n  vacio["Todavía no hay pasos"]';
  }

  const lines = ["flowchart TD"];

  for (const paso of pasos) {
    const id = nodeId(paso.id);
    if (paso.tipo === "decision") {
      lines.push(`  ${id}{"${escapeLabel(paso.pregunta || paso.titulo)}"}`);
    } else {
      lines.push(`  ${id}["${escapeLabel(paso.titulo)}"]`);
    }
  }

  for (const paso of pasos) {
    const id = nodeId(paso.id);
    if (paso.tipo === "decision") {
      if (paso.rama_si) lines.push(`  ${id} -->|Sí| ${nodeId(paso.rama_si)}`);
      if (paso.rama_no) lines.push(`  ${id} -->|No| ${nodeId(paso.rama_no)}`);
    } else if (paso.siguiente_paso_id) {
      lines.push(`  ${id} --> ${nodeId(paso.siguiente_paso_id)}`);
    }
  }

  return lines.join("\n");
}
