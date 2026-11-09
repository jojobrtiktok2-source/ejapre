import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function Header({ titulo, voltar = true, direita }: { titulo: string; voltar?: boolean; direita?: ReactNode }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-4 flex items-center gap-3 border-b border-white/[0.05] bg-bg/75 px-4 py-3 backdrop-blur-xl">
      {voltar && (
        <button onClick={() => nav(-1)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/[0.07] bg-surface-2/80 transition hover:border-accent/40" aria-label="Voltar">
          <ChevronLeft size={20} />
        </button>
      )}
      <h1 className="h2 flex-1 truncate">{titulo}</h1>
      {direita}
    </header>
  );
}

export function Secao({ titulo, children, acao }: { titulo: string; children: ReactNode; acao?: ReactNode }) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="h2">{titulo}</h2>
        {acao}
      </div>
      {children}
    </section>
  );
}

export function Barra({ valor, className = "" }: { valor: number; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all" style={{ width: `${Math.round(valor * 100)}%` }} />
    </div>
  );
}

export function Lista({ itens, numerada = false }: { itens: string[]; numerada?: boolean }) {
  return (
    <ol className="space-y-2">
      {itens.map((t, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/90">
          <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${numerada ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted"}`}>
            {numerada ? i + 1 : "•"}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ol>
  );
}

export const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return m ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
};
