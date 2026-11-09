import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronRight, Lightbulb, BookOpen } from "lucide-react";
import { Header } from "@/components/ui";
import { Midia } from "@/components/Img";
import { Player } from "@/components/Player";
import { artigoPorId, exercicioPorId, nomeCategoria, programa } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function DiaPage() {
  const { dia: p } = useParams();
  const nav = useNavigate();
  const s = useStore();
  const dia = programa.dias.find((d) => d.dia === Number(p));
  const [ativo, setAtivo] = useState(0);
  const [feitos, setFeitos] = useState<string[]>([]);
  if (!dia) return <Header titulo="Dia não encontrado" />;
  const exs = dia.exercicios.map((id) => exercicioPorId(id)!).filter(Boolean);
  const ex = exs[ativo];
  const artigo = dia.artigo ? artigoPorId(dia.artigo) : undefined;
  const concluido = s.diasConcluidos.includes(dia.dia);

  const terminarEx = () => {
    s.registrarTreino(ex.id);
    setFeitos((f) => (f.includes(ex.id) ? f : [...f, ex.id]));
  };

  const finalizarDia = () => {
    s.concluirDia(dia.dia);
    nav("/", { replace: true });
  };

  return (
    <div className="animate-fade-up">
      <Header titulo={`Dia ${dia.dia} · ${dia.titulo}`} />

      <div className="card flex gap-3 p-4">
        <Lightbulb className="shrink-0 text-warn" size={20} />
        <p className="text-sm leading-relaxed">{dia.dica}</p>
      </div>

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {exs.map((e, k) => (
          <button key={e.id} onClick={() => setAtivo(k)} className={k === ativo ? "chip-on" : "chip"}>
            {feitos.includes(e.id) && <Check size={12} />} {k + 1}. {e.nome}
          </button>
        ))}
      </div>

      <div key={ex.id} className="mt-4 animate-fade-up">
        <div className="card overflow-hidden">
          <Midia ex={ex} className="aspect-[16/10] w-full" />
          <div className="p-4">
            <p className="label text-accent">{nomeCategoria(ex.categoria)}</p>
            <h2 className="h2">{ex.nome}</h2>
            <p className="mt-1 text-sm text-muted">{ex.objetivo}</p>
            <Link to={`/exercicio/${ex.id}`} className="mt-2 inline-flex items-center gap-1 text-sm text-accent">
              Ver passo a passo <ChevronRight size={14} />
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <Player ex={ex} onConcluir={terminarEx} />
        </div>
        {feitos.includes(ex.id) && ativo < exs.length - 1 && (
          <button className="btn-ghost mt-3 w-full" onClick={() => setAtivo(ativo + 1)}>
            Próximo exercício <ChevronRight size={18} />
          </button>
        )}
      </div>

      {artigo && (
        <Link to={`/aprender/${artigo.id}`} className="card mt-6 flex items-center gap-3 p-4">
          <BookOpen className="text-accent" />
          <div className="flex-1">
            <p className="label">Leitura do dia</p>
            <p className="font-medium">{artigo.titulo}</p>
          </div>
          <ChevronRight className="text-muted" />
        </Link>
      )}

      <button className="btn-primary mt-6 w-full" onClick={finalizarDia} disabled={concluido}>
        {concluido ? "Dia já concluído" : `Concluir dia ${dia.dia}`}
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        {feitos.length}/{exs.length} exercícios feitos nesta sessão
      </p>
    </div>
  );
}
