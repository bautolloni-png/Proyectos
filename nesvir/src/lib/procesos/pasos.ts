import type { Paso, TipoPaso } from "@/lib/types/database";

export function crearPasoVacio(tipo: TipoPaso = "accion"): Paso {
  return {
    id: crypto.randomUUID(),
    orden: 0,
    titulo: "",
    descripcion: "",
    responsable: "",
    tipo,
    siguiente_paso_id: null,
    pregunta: "",
    rama_si: null,
    rama_no: null,
    checklist: [],
  };
}

// Accion steps flow to the next step in the list automatically; decision
// steps only need a default for rama_si so a user who fills in just the
// "No" branch (or neither) still gets a working diagram.
export function finalizarPasos(pasos: Paso[]): Paso[] {
  return pasos.map((paso, index) => {
    const siguiente = index < pasos.length - 1 ? pasos[index + 1].id : null;

    if (paso.tipo === "decision") {
      return {
        ...paso,
        orden: index + 1,
        siguiente_paso_id: null,
        rama_si: paso.rama_si || siguiente,
      };
    }

    return { ...paso, orden: index + 1, siguiente_paso_id: siguiente };
  });
}
