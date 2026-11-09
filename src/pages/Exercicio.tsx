import { useParams } from "react-router-dom";
import { AlertTriangle, Sparkles, Target } from "lucide-react";
import { Header, Lista, Secao, fmt } from "@/components/ui";
import { Midia } from "@/components/Img";
import { Player } from "@/components/Player";
import { duracaoTimer, exercicioPorId, nomeCategoria } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function ExercicioPage() {
  const { id } = useParams();
  const ex = exercicioPorId(id ?? "");
  const { registrarTreino } = useStore();
  if (!ex) return <Header titulo="Exercício não encontrado" />;
  const dur = duracaoTimer(ex);

  return (
    <div className="animate-fade-up">
      <Header titulo={ex.nome} />
      <div className="card overflow-hidden">
        <Midia ex={ex} className="aspect-[16/10] w-full" />
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            <span className="chip-on">{nomeCategoria(ex.categoria)}</span>
            <span className="chip">~{fmt(dur)}</span>
          </div>
          <p className="mt-3 flex gap-2 text-sm leading-relaxed">
            <Target size={18} className="shrink-0 text-accent" /> {ex.objetivo}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Player ex={ex} onConcluir={() => registrarTreino(ex.id)} />
      </div>

      <Secao titulo="Por que ajuda">
        <div className="card flex gap-3 p-4 text-sm leading-relaxed text-ink/90">
          <Sparkles size={18} className="shrink-0 text-accent" />
          {ex.porQueAjuda}
        </div>
      </Secao>
      <Secao titulo="Passo a passo">
        <Lista itens={ex.passos} numerada />
      </Secao>
      <Secao titulo="Dicas">
        <Lista itens={ex.dicas} />
      </Secao>
      <Secao titulo="Erros comuns">
        <div className="card space-y-2 border-danger/30 p-4">
          {ex.erros.map((e) => (
            <p key={e} className="flex gap-2 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" /> {e}
            </p>
          ))}
        </div>
      </Secao>
      {ex.frames && (
        <p className="mt-6 text-center text-[11px] text-muted">
          Imagens: free-exercise-db (domínio público)
        </p>
      )}
    </div>
  );
}
