"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type SearchablePaso = { titulo: string; descripcion: string };
export type SearchableProceso = {
  id: string;
  nombre: string;
  descripcion: string;
  pasos: SearchablePaso[];
};

type Match = { proceso: SearchableProceso; snippet: string | null };

export function GlobalSearch({ procesos }: { procesos: SearchableProceso[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo<Match[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: Match[] = [];
    for (const proceso of procesos) {
      if (
        proceso.nombre.toLowerCase().includes(q) ||
        proceso.descripcion.toLowerCase().includes(q)
      ) {
        matches.push({ proceso, snippet: null });
        continue;
      }

      const pasoMatch = proceso.pasos.find(
        (paso) =>
          paso.titulo.toLowerCase().includes(q) || paso.descripcion.toLowerCase().includes(q),
      );
      if (pasoMatch) {
        matches.push({ proceso, snippet: pasoMatch.titulo || pasoMatch.descripcion });
      }
    }
    return matches.slice(0, 8);
  }, [query, procesos]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar procesos y pasos…"
        className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-accent"
      />

      {open && query.trim() && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-black/10 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-foreground/50">Sin resultados.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map(({ proceso, snippet }) => (
                <li key={proceso.id}>
                  <Link
                    href={`/dashboard/procesos/${proceso.id}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="block px-3 py-2 hover:bg-black/[0.03]"
                  >
                    <p className="text-sm font-medium text-foreground">{proceso.nombre}</p>
                    {snippet && (
                      <p className="truncate text-xs text-foreground/50">Paso: {snippet}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
