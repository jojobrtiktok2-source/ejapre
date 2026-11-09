import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, CalendarDays, ChevronRight } from "lucide-react";
import { Img, Midia, iconeCategoria } from "@/components/Img";
import { categorias, exercicios } from "@/lib/data";
import type { Categoria } from "@/lib/types";

const niveis = ["", "Iniciante", "Intermediário", "Avançado"];

export default function Treinar() {
  const [cat, setCat] = useState<Categoria | "todos">("todos");
  const lista = cat === "todos" ? exercicios : exercicios.filter((e) => e.categoria === cat);

  return (
    <div className="pt-5 animate-fade-up">
      <h1 className="h1">Treinar</h1>
      <p className="mt-1 text-sm text-muted">{exercicios.length} exercícios com cronômetro guiado</p>

      <Link to="/programa" className="card mt-5 flex items-center gap-3 p-4">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
          <CalendarDays />
        </div>
        <div className="flex-1">
          <p className="font-semibold">Programa de 30 dias</p>
          <p className="text-xs text-muted">Treino do dia montado para você</p>
        </div>
        <ChevronRight className="text-muted" />
      </Link>

      <div className="no-scrollbar -mx-4 mt-6 flex gap-3 overflow-x-auto px-4">
        {categorias.map((c) => (
          <button key={c.id} onClick={() => setCat(cat === c.id ? "todos" : c.id)} className={`card w-36 shrink-0 overflow-hidden text-left ${cat === c.id ? "border-accent" : ""}`}>
            <Img src={c.imagem} alt={c.nome} className="aspect-[4/3] w-full" icon={iconeCategoria[c.id]} />
            <div className="p-2.5">
              <p className="text-sm font-semibold leading-tight">{c.nome}</p>
              <p className="mt-0.5 text-[11px] leading-tight text-muted">{c.descricao}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {lista.map((e) => (
          <Link key={e.id} to={`/exercicio/${e.id}`} className="card flex items-center gap-3 overflow-hidden p-2 pr-4">
            <Midia ex={e} className="h-20 w-24 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{e.nome}</p>
              <p className="line-clamp-2 text-xs text-muted">{e.objetivo}</p>
              <div className="mt-1.5 flex gap-2 text-[11px] text-muted">
                <span className="inline-flex items-center gap-1"><Clock size={11} /> {e.duracaoMin} min</span>
                <span>· {niveis[e.nivel]}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
