import { GlobalSearch, type SearchableProceso } from "./GlobalSearch";

export function DashboardHeader({ procesos }: { procesos: SearchableProceso[] }) {
  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-background px-8 py-3">
      <GlobalSearch procesos={procesos} />
    </header>
  );
}
