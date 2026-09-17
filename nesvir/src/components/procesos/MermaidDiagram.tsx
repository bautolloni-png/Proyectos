"use client";

import { useEffect, useId, useRef, useState } from "react";

export function MermaidDiagram({ chart }: { chart: string }) {
  const rawId = useId();
  const id = `mermaid${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          primaryColor: "#B7E6FC",
          primaryTextColor: "#1A1A1A",
          primaryBorderColor: "#5198D5",
          lineColor: "#5198D5",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        },
      });

      try {
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch {
        if (!cancelled) setError("No se pudo generar el diagrama.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return <p className="text-sm text-foreground/50">{error}</p>;
  }

  return <div ref={containerRef} className="overflow-x-auto" />;
}
