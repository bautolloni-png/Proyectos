import { getVigencia, VIGENCIA_CLASSES } from "@/lib/procesos/vigencia";

export function VigenciaBadge({
  actualizadoEn,
  className = "",
}: {
  actualizadoEn: string;
  className?: string;
}) {
  const { label, tier } = getVigencia(actualizadoEn);

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${VIGENCIA_CLASSES[tier]} ${className}`}
    >
      {label}
    </span>
  );
}
