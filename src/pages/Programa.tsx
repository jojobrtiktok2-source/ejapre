import { Link } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import { Header, Barra } from "@/components/ui";
import { Img, iconeFase } from "@/components/Img";
import { programa } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function Programa() {
  const { diasConcluidos, diaAtual } = useStore();
  return (
    <div className="animate-fade-up">
      <Header titulo="Programa de 30 dias" />
      <div className="card p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted">Seu progresso</span>
          <span className="font-display font-bold">{diasConcluidos.length}/30</span>
        </div>
        <Barra valor={diasConcluidos.length / 30} className="mt-2" />
      </div>

      {programa.fases.map((f) => (
        <section key={f.semana} className="mt-6">
          <div className="card overflow-hidden">
            <Img src={f.imagem} alt={f.nome} className="aspect-[21/9] w-full" icon={iconeFase[f.semana]} />
            <div className="p-4">
              <p className="label text-accent">Semana {f.semana}</p>
              <h2 className="h2">{f.nome}</h2>
              <p className="mt-1 text-sm text-muted">{f.descricao}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {programa.dias
              .filter((d) => d.semana === f.semana)
              .map((d) => {
                const feito = diasConcluidos.includes(d.dia);
                const bloqueado = d.dia > diaAtual;
                return (
                  <Link
                    key={d.dia}
                    to={bloqueado ? "#" : `/programa/${d.dia}`}
                    onClick={(e) => bloqueado && e.preventDefault()}
                    className={`card flex items-center gap-3 p-3 ${bloqueado ? "opacity-50" : ""} ${d.dia === diaAtual ? "border-accent/60" : ""}`}
                  >
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display font-bold ${feito ? "bg-accent text-bg" : "bg-surface-2"}`}>
                      {feito ? <Check size={18} /> : bloqueado ? <Lock size={16} /> : d.dia}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">Dia {d.dia} · {d.titulo}</p>
                      <p className="text-xs text-muted">{d.exercicios.length} exercícios</p>
                    </div>
                    {d.dia === diaAtual && !feito && <span className="chip-on">Hoje</span>}
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
