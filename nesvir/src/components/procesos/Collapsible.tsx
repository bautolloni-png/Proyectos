"use client";

import { useState } from "react";

export function Collapsible({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <span
          className={`inline-block text-xs transition-transform ${open ? "rotate-90" : ""}`}
        >
          ›
        </span>
        {label}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
