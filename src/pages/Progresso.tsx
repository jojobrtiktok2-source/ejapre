import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Award, Plus, Trash2, X, Users, User, Lock } from "lucide-react";
import { Secao } from "@/components/ui";
import { Img } from "@/components/Img";
import { programa } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { Registro } from "@/lib/types";
import { corTexto, faixaDe } from "./Quiz";

const tecnicasOpcoes = ["Respiração", "Para e recomeça", "Aperto", "Kegel reverso", "Troca de posição", "Ritmo lento"];
const rotulosControle = ["", "Nenhum", "Pouco", "Médio", "Bom", "Total"];

function Grafico({ dados }: { dados: Registro[] }) {
  const pts = [...dados].reverse().slice(-12);
  if (pts.length < 2)
    return <p className="py-8 text-center text-sm text-muted">Faça pelo menos 2 registros para ver o gráfico.</p>;
  const max = Math.max(...pts.map((p) => p.minutos), 5);
  const W = 320, H = 140, pad = 20;
  const x = (i: number) => pad + (i * (W - pad * 2)) / (pts.length - 1);
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const linha = pts.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.minutos)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Evolução do tempo">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2DD4BF" stopOpacity=".35" />
          <stop offset="1" stopColor="#2DD4BF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${linha} L${x(pts.length - 1)},${H - pad} L${x(0)},${H - pad} Z`} fill="url(#g)" />
      <path d={linha} fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={p.id}>
          <circle cx={x(i)} cy={y(p.minutos)} r="4" fill={p.tipo === "parceria" ? "#38BDF8" : "#2DD4BF"} />
          <text x={x(i)} y={y(p.minutos) - 8} textAnchor="middle" fontSize="9" fill="#8C9BB8">{p.minutos}</text>
        </g>
      ))}
    </svg>
  );
}

function Formulario({ onFechar }: { onFechar: () => void }) {
  const { salvarRegistro } = useStore();
  const [r, setR] = useState<Registro>({
    id: crypto.randomUUID(), data: new Date().toISOString(), tipo: "solo", minutos: 5, controle: 3, tecnicas: [], notas: "",
  });
  const up = (p: Partial<Registro>) => setR({ ...r, ...p });
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={onFechar}>
      <div className="mx-auto max-h-[90dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-3xl bg-surface p-5 animate-fade-up" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="h2">Novo registro</h2>
          <button onClick={onFechar} className="grid h-9 w-9 place-items-center rounded-full bg-surface-2" aria-label="Fechar"><X size={18} /></button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {(["solo", "parceria"] as const).map((t) => (
            <button key={t} onClick={() => up({ tipo: t })} className={`btn ${r.tipo === t ? "bg-accent text-bg" : "bg-surface-2"}`}>
              {t === "solo" ? <User size={18} /> : <Users size={18} />} {t === "solo" ? "Treino solo" : "Com parceria"}
            </button>
          ))}
        </div>
        <label className="label mt-5 block">Tempo de duração: {r.minutos} min</label>
        <input type="range" min={0} max={30} value={r.minutos} onChange={(e) => up({ minutos: +e.target.value })} className="mt-2 w-full accent-[#2DD4BF]" />
        <label className="label mt-5 block">Sensação de controle: {rotulosControle[r.controle]}</label>
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => up({ controle: n })} className={`rounded-xl py-2.5 font-semibold ${r.controle >= n ? "bg-accent text-bg" : "bg-surface-2 text-muted"}`}>{n}</button>
          ))}
        </div>
        <label className="label mt-5 block">Técnicas usadas</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {tecnicasOpcoes.map((t) => (
            <button key={t} onClick={() => up({ tecnicas: r.tecnicas.includes(t) ? r.tecnicas.filter((x) => x !== t) : [...r.tecnicas, t] })} className={r.tecnicas.includes(t) ? "chip-on" : "chip"}>{t}</button>
          ))}
        </div>
        <label className="label mt-5 block">Como você se sentiu?</label>
        <textarea value={r.notas} onChange={(e) => up({ notas: e.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-line bg-surface-2 p-3 text-sm outline-none focus:border-accent" placeholder="Opcional" />
        <button className="btn-primary mt-5 w-full" onClick={() => { salvarRegistro(r); onFechar(); }}>Salvar</button>
      </div>
    </div>,
    document.body,
  );
}

export default function Progresso() {
  const s = useStore();
  const [form, setForm] = useState(false);
  const ultimoQuiz = s.quiz[s.quiz.length - 1];
  const primeiroQuiz = s.quiz[0];
  const media = (arr: Registro[]) => (arr.length ? (arr.reduce((a, r) => a + r.minutos, 0) / arr.length).toFixed(1) : "—");
  const parceria = s.diario.filter((r) => r.tipo === "parceria");

  return (
    <div className="pt-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="h1">Progresso</h1>
        <button className="btn-primary px-3 py-2 text-sm" onClick={() => setForm(true)}><Plus size={16} /> Registrar</button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="card p-3 text-center">
          <p className="font-display text-2xl font-bold">{s.treinos.length}</p>
          <p className="text-[11px] text-muted">Exercícios feitos</p>
        </div>
        <div className="card p-3 text-center">
          <p className="font-display text-2xl font-bold">{s.sequencia}</p>
          <p className="text-[11px] text-muted">Dias seguidos</p>
        </div>
        <div className="card p-3 text-center">
          <p className="font-display text-2xl font-bold">{media(parceria)}</p>
          <p className="text-[11px] text-muted">Média a dois (min)</p>
        </div>
      </div>

      <Secao titulo="Evolução do tempo">
        <div className="card p-4">
          <Grafico dados={s.diario} />
          <div className="mt-2 flex justify-center gap-4 text-[11px] text-muted">
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-accent" /> Solo</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-accent-2" /> Parceria</span>
          </div>
        </div>
      </Secao>

      <Secao titulo="Autoavaliação" acao={<Link to="/avaliacao" className="text-sm text-accent">Refazer</Link>}>
        {ultimoQuiz ? (
          <div className="card p-4">
            <div className="flex items-baseline justify-between">
              <span className={`font-display text-3xl font-bold ${corTexto[faixaDe(ultimoQuiz.pontos).cor]}`}>{ultimoQuiz.pontos}/20</span>
              <span className="text-sm text-muted">{faixaDe(ultimoQuiz.pontos).nivel}</span>
            </div>
            {s.quiz.length > 1 && (
              <p className="mt-2 text-sm text-muted">
                Primeira avaliação: {primeiroQuiz.pontos}/20 ·{" "}
                <b className={ultimoQuiz.pontos <= primeiroQuiz.pontos ? "text-accent" : "text-warn"}>
                  {ultimoQuiz.pontos <= primeiroQuiz.pontos ? `${primeiroQuiz.pontos - ultimoQuiz.pontos} pontos melhor` : "oscilou, continue firme"}
                </b>
              </p>
            )}
            <p className="mt-1 text-xs text-muted">Quanto menor a pontuação, melhor. Refaça a cada 2 semanas.</p>
          </div>
        ) : (
          <Link to="/avaliacao" className="card block p-4 text-sm text-muted">Faça sua primeira avaliação</Link>
        )}
      </Secao>

      <Secao titulo="Conquistas">
        <div className="grid grid-cols-4 gap-3">
          {programa.conquistas.map((c) => {
            const on = s.conquistas.has(c.id);
            return (
              <div key={c.id} className="text-center" title={c.descricao}>
                <div className={`relative mx-auto aspect-square w-full overflow-hidden rounded-2xl ${on ? "" : "opacity-35 grayscale"}`}>
                  <Img src={c.imagem} alt={c.nome} className="h-full w-full" icon={on ? <Award /> : <Lock />} />
                </div>
                <p className="mt-1 text-[10px] leading-tight text-muted">{c.nome}</p>
              </div>
            );
          })}
        </div>
      </Secao>

      <Secao titulo="Diário">
        {s.diario.length === 0 && <p className="card p-4 text-sm text-muted">Nenhum registro ainda. Toque em Registrar depois de um treino solo ou uma relação.</p>}
        <div className="space-y-2">
          {s.diario.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center gap-2">
                {r.tipo === "solo" ? <User size={16} className="text-accent" /> : <Users size={16} className="text-accent-2" />}
                <span className="font-semibold">{r.minutos} min</span>
                <span className="text-xs text-muted">· controle {rotulosControle[r.controle].toLowerCase()}</span>
                <span className="ml-auto text-xs text-muted">{new Date(r.data).toLocaleDateString("pt-BR")}</span>
                <button onClick={() => s.removerRegistro(r.id)} className="text-muted hover:text-danger" aria-label="Apagar"><Trash2 size={15} /></button>
              </div>
              {r.tecnicas.length > 0 && <p className="mt-1 text-xs text-muted">{r.tecnicas.join(" · ")}</p>}
              {r.notas && <p className="mt-2 text-sm text-ink/80">{r.notas}</p>}
            </div>
          ))}
        </div>
      </Secao>

      {form && <Formulario onFechar={() => setForm(false)} />}
    </div>
  );
}
