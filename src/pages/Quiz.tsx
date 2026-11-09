import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { quiz } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Header } from "@/components/ui";

export function faixaDe(pontos: number) {
  return quiz.faixas.find((f) => pontos >= f.min && pontos <= f.max) ?? quiz.faixas[quiz.faixas.length - 1];
}
export const corTexto: Record<string, string> = { accent: "text-accent", warn: "text-warn", danger: "text-danger" };

export default function Quiz() {
  const { salvarQuiz, set, onboarded } = useStore();
  const nav = useNavigate();
  const [resp, setResp] = useState<number[]>([]);
  const [tempo, setTempo] = useState<number | null>(null);
  const passo = resp.length;
  const total = quiz.perguntas.length + 1;
  const pontos = resp.reduce((a, b) => a + b, 0);

  const escolher = (v: number) => {
    if (passo < quiz.perguntas.length) setResp([...resp, v]);
    else {
      setTempo(v);
      salvarQuiz({ data: new Date().toISOString(), pontos, tempo: v });
    }
  };

  if (tempo !== null) {
    const f = faixaDe(pontos);
    return (
      <div className="flex min-h-dvh flex-col py-6 animate-fade-up">
        <p className="label">Seu resultado</p>
        <div className="card mt-4 p-6 text-center">
          <div className={`font-display text-6xl font-bold ${corTexto[f.cor]}`}>
            {pontos}
            <span className="text-2xl text-muted">/20</span>
          </div>
          <div className={`mt-2 font-display text-xl font-semibold ${corTexto[f.cor]}`}>{f.nivel}</div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{f.texto}</p>
        </div>
        <div className="card mt-4 p-4 text-sm">
          <span className="text-muted">Tempo médio informado: </span>
          <b>{quiz.tempo.opcoes[tempo]}</b>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">{quiz.aviso}</p>
        <div className="mt-auto pt-8">
          <button
            className="btn-primary w-full"
            onClick={() => {
              set({ onboarded: true });
              nav("/", { replace: true });
            }}
          >
            {onboarded ? "Voltar ao início" : "Começar meu programa"}
          </button>
        </div>
      </div>
    );
  }

  const pergunta = passo < quiz.perguntas.length ? quiz.perguntas[passo] : { texto: quiz.tempo.texto, opcoes: quiz.tempo.opcoes };
  return (
    <div className="flex min-h-dvh flex-col py-2">
      {onboarded ? <Header titulo="Autoavaliação" /> : <div className="h-4" />}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-accent transition-all" style={{ width: `${(passo / total) * 100}%` }} />
        </div>
        <span className="text-xs text-muted">
          {passo + 1}/{total}
        </span>
      </div>
      <div key={passo} className="animate-fade-up">
        <h1 className="h1 mt-8">{pergunta.texto}</h1>
        <div className="mt-6 space-y-3">
          {pergunta.opcoes.map((o, k) => (
            <button key={o} onClick={() => escolher(k)} className="card w-full p-4 text-left transition hover:border-accent/60 active:scale-[.99]">
              {o}
            </button>
          ))}
        </div>
      </div>
      {passo > 0 && (
        <button className="mt-6 text-sm text-muted" onClick={() => setResp(resp.slice(0, -1))}>
          Voltar
        </button>
      )}
    </div>
  );
}
