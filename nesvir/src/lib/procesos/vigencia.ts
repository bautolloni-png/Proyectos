export type VigenciaTier = "reciente" | "media" | "antigua";

export type Vigencia = {
  label: string;
  tier: VigenciaTier;
};

const DIA_MS = 24 * 60 * 60 * 1000;

export function getVigencia(actualizadoEn: string): Vigencia {
  const dias = Math.max(
    0,
    Math.floor((Date.now() - new Date(actualizadoEn).getTime()) / DIA_MS),
  );

  const tier: VigenciaTier = dias < 30 ? "reciente" : dias < 90 ? "media" : "antigua";

  let label: string;
  if (dias < 1) {
    label = "Actualizado hoy";
  } else if (dias === 1) {
    label = "Actualizado hace 1 día";
  } else if (dias < 30) {
    label = `Actualizado hace ${dias} días`;
  } else {
    const meses = Math.round(dias / 30);
    label = meses === 1 ? "Actualizado hace 1 mes" : `Actualizado hace ${meses} meses`;
  }

  return { label, tier };
}

export const VIGENCIA_CLASSES: Record<VigenciaTier, string> = {
  reciente: "bg-accent-light text-navy",
  media: "bg-black/[0.06] text-foreground/70",
  antigua: "bg-amber-100 text-amber-800",
};
