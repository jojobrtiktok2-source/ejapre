import { useState } from "react";
import { Link } from "react-router-dom";
import { Apple, Ban, ChefHat, Clock, Info, Pill } from "lucide-react";
import { Img } from "@/components/Img";
import { alimentacao } from "@/lib/data";

const abas = ["Aliados", "Nutrientes", "Cardápio", "Receitas", "Evitar"] as const;
type Aba = (typeof abas)[number];

export default function Nutricao() {
  const [aba, setAba] = useState<Aba>("Aliados");
  const [filtro, setFiltro] = useState<string | null>(null);
  const [dia, setDia] = useState(1);
  const nomeNutriente = (id: string) => alimentacao.nutrientes.find((n) => n.id === id)?.nome ?? id;
  const alimentos = filtro ? alimentacao.alimentos.filter((a) => a.nutrientes.includes(filtro)) : alimentacao.alimentos;
  const cardapio = alimentacao.cardapio.find((c) => c.dia === dia)!;

  return (
    <div className="pt-5 animate-fade-up">
      <h1 className="h1">Nutrição</h1>
      <div className="card mt-4 flex gap-3 p-3 text-xs leading-relaxed text-muted">
        <Info size={16} className="shrink-0 text-accent" /> {alimentacao.aviso}
      </div>

      <div className="no-scrollbar sticky top-0 z-10 -mx-4 mt-4 flex gap-2 overflow-x-auto bg-bg/90 px-4 py-2 backdrop-blur">
        {abas.map((a) => (
          <button key={a} onClick={() => setAba(a)} className={aba === a ? "chip-on" : "chip"}>
            {a}
          </button>
        ))}
      </div>

      {aba === "Aliados" && (
        <div className="mt-3">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            <button onClick={() => setFiltro(null)} className={!filtro ? "chip-on" : "chip"}>Todos</button>
            {alimentacao.nutrientes.map((n) => (
              <button key={n.id} onClick={() => setFiltro(n.id)} className={filtro === n.id ? "chip-on" : "chip"}>
                {n.nome}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {alimentos.map((a) => (
              <div key={a.id} className="card overflow-hidden">
                <Img src={a.imagem} alt={a.nome} className="aspect-square w-full" icon={<Apple />} />
                <div className="p-3">
                  <p className="text-sm font-semibold">{a.nome}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted">{a.porque}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {a.nutrientes.map((n) => (
                      <span key={n} className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent">{nomeNutriente(n)}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aba === "Nutrientes" && (
        <div className="mt-3 space-y-3">
          {alimentacao.nutrientes.map((n) => (
            <div key={n.id} className="card p-4">
              <h3 className="h2">{n.nome}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/90">{n.papel}</p>
              <p className="mt-2 text-xs text-accent">Meta: {n.meta}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {n.fontes.map((f) => <span key={f} className="chip">{f}</span>)}
              </div>
            </div>
          ))}
          <div className="card border-warn/30 p-4">
            <h3 className="h2 flex items-center gap-2"><Pill size={18} className="text-warn" /> Suplementos</h3>
            <p className="mt-1 text-xs text-muted">{alimentacao.suplementos.aviso}</p>
            <ul className="mt-3 space-y-2">
              {alimentacao.suplementos.itens.map((i) => (
                <li key={i.nome} className="text-sm"><b>{i.nome}:</b> <span className="text-muted">{i.nota}</span></li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {aba === "Cardápio" && (
        <div className="mt-3">
          <div className="grid grid-cols-7 gap-1.5">
            {alimentacao.cardapio.map((c) => (
              <button key={c.dia} onClick={() => setDia(c.dia)} className={`rounded-xl py-2 text-sm font-semibold ${dia === c.dia ? "bg-accent text-bg" : "bg-surface-2 text-muted"}`}>
                D{c.dia}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {cardapio.refeicoes.map((r) => (
              <div key={r.tipo} className="card p-4">
                <p className="label">{r.tipo}</p>
                <p className="mt-1 text-sm">{r.prato}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Ajuste as quantidades à sua fome e objetivo. Pessoas com doenças crônicas devem consultar um nutricionista.</p>
        </div>
      )}

      {aba === "Receitas" && (
        <div className="mt-3 space-y-3">
          {alimentacao.receitas.map((r) => (
            <Link key={r.id} to={`/receita/${r.id}`} className="card flex gap-3 overflow-hidden p-2 pr-4">
              <Img src={r.imagem} alt={r.nome} className="h-20 w-20 shrink-0 rounded-xl" icon={<ChefHat />} />
              <div className="min-w-0 flex-1 py-1">
                <p className="font-semibold">{r.nome}</p>
                <p className="line-clamp-2 text-xs text-muted">{r.beneficio}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted"><Clock size={11} /> {r.tempo}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {aba === "Evitar" && (
        <div className="mt-3 space-y-2">
          {alimentacao.evitar.map((e) => (
            <div key={e.nome} className="card flex gap-3 p-4">
              <Ban size={18} className="mt-0.5 shrink-0 text-danger" />
              <div>
                <p className="font-semibold">{e.nome}</p>
                <p className="text-sm text-muted">{e.porque}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
