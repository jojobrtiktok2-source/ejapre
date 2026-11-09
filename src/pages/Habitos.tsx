import { useState } from "react";
import { Check, ChevronDown, Settings2 } from "lucide-react";
import { iconesHabito } from "@/components/icones";
import { Barra } from "@/components/ui";
import { habitos } from "@/lib/data";
import { hoje, useStore } from "@/lib/store";

const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function Habitos() {
  const s = useStore();
  const [data, setData] = useState(hoje());
  const [aberto, setAberto] = useState<string | null>(null);
  const [editar, setEditar] = useState(false);

  const semana = Array.from({ length: 7 }, (_, k) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - k));
    return d;
  });
  const marcados = s.habitos[data] ?? [];
  const ativos = habitos.filter((h) => s.habitosAtivos.includes(h.id));
  const lista = editar ? habitos : ativos;
  const feitos = ativos.filter((h) => marcados.includes(h.id)).length;

  const alternarAtivo = (id: string) =>
    s.set({ habitosAtivos: s.habitosAtivos.includes(id) ? s.habitosAtivos.filter((x) => x !== id) : [...s.habitosAtivos, id] });

  return (
    <div className="pt-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="h1">Hábitos</h1>
        <button onClick={() => setEditar(!editar)} className={editar ? "chip-on" : "chip"}>
          <Settings2 size={14} /> {editar ? "Pronto" : "Escolher"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {semana.map((d) => {
          const k = hoje(d);
          const n = (s.habitos[k] ?? []).filter((h) => s.habitosAtivos.includes(h)).length;
          const pct = s.habitosAtivos.length ? n / s.habitosAtivos.length : 0;
          return (
            <button key={k} onClick={() => setData(k)} className={`flex flex-col items-center gap-1 rounded-xl py-2 ${data === k ? "bg-surface-2 ring-1 ring-accent/60" : ""}`}>
              <span className="text-[11px] text-muted">{diasSemana[d.getDay()]}</span>
              <span className="text-sm font-semibold">{d.getDate()}</span>
              <span className="h-1.5 w-6 overflow-hidden rounded-full bg-surface-2">
                <span className="block h-full bg-accent" style={{ width: `${pct * 100}%` }} />
              </span>
            </button>
          );
        })}
      </div>

      {!editar && (
        <div className="card mt-4 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">{data === hoje() ? "Hoje" : new Date(data + "T12:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}</span>
            <span className="font-display font-bold">{feitos}/{ativos.length}</span>
          </div>
          <Barra valor={ativos.length ? feitos / ativos.length : 0} className="mt-2" />
        </div>
      )}
      {editar && <p className="mt-4 text-sm text-muted">Escolha quais hábitos você quer acompanhar todos os dias.</p>}

      <div className="mt-4 space-y-2">
        {lista.map((h) => {
          const Icon = iconesHabito[h.icone] ?? Check;
          const on = editar ? s.habitosAtivos.includes(h.id) : marcados.includes(h.id);
          return (
            <div key={h.id} className={`card overflow-hidden transition ${on ? "border-accent/50" : ""}`}>
              <div className="flex items-center gap-3 p-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted"}`}>
                  <Icon size={20} />
                </div>
                <button className="min-w-0 flex-1 text-left" onClick={() => setAberto(aberto === h.id ? null : h.id)}>
                  <p className="font-medium">{h.nome}</p>
                  <p className="flex items-center gap-1 text-xs text-muted">
                    {h.categoria} <ChevronDown size={12} className={`transition ${aberto === h.id ? "rotate-180" : ""}`} />
                  </p>
                </button>
                <button
                  onClick={() => (editar ? alternarAtivo(h.id) : s.alternarHabito(h.id, data))}
                  className={`grid h-9 w-9 place-items-center rounded-full border-2 transition ${on ? "border-accent bg-accent text-bg" : "border-line"}`}
                  aria-label={on ? "Desmarcar" : "Marcar"}
                >
                  {on && <Check size={18} strokeWidth={3} />}
                </button>
              </div>
              {aberto === h.id && (
                <div className="border-t border-line p-4 text-sm animate-fade-up">
                  <p className="leading-relaxed text-ink/90">{h.porque}</p>
                  <ul className="mt-3 space-y-1.5">
                    {h.comoFazer.map((c) => (
                      <li key={c} className="flex gap-2 text-muted"><span className="text-accent">•</span>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
