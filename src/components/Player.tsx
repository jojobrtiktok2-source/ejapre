import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward, Check } from "lucide-react";
import type { Exercicio } from "@/lib/types";
import { useStore } from "@/lib/store";

type Fase = "contrair" | "relaxar" | "inspirar" | "segurar" | "expirar" | "descanso" | "ativo" | "manual" | "pausa";
interface Passo {
  rotulo: string;
  segundos: number | null; // null = o usuário avança
  fase: Fase;
  info: string;
  botao?: string;
}

function montarPassos(ex: Exercicio): Passo[] {
  const t = ex.timer;
  const p: Passo[] = [];
  switch (t.tipo) {
    case "intervalo": {
      const [a, b] = t.rotulos ?? ["Contrair", "Relaxar"];
      for (let s = 1; s <= t.series; s++) {
        for (let r = 1; r <= t.reps; r++) {
          const info = `Série ${s}/${t.series} · Repetição ${r}/${t.reps}`;
          p.push({ rotulo: a, segundos: t.contrair, fase: "contrair", info });
          p.push({ rotulo: b, segundos: t.relaxar, fase: "relaxar", info });
        }
        if (s < t.series) p.push({ rotulo: "Descanso", segundos: t.descanso, fase: "descanso", info: `Próxima: série ${s + 1}` });
      }
      break;
    }
    case "respiracao":
      for (let c = 1; c <= t.ciclos; c++) {
        const info = `Ciclo ${c}/${t.ciclos}`;
        p.push({ rotulo: "Inspire", segundos: t.inspirar, fase: "inspirar", info });
        if (t.segurar) p.push({ rotulo: "Segure", segundos: t.segurar, fase: "segurar", info });
        p.push({ rotulo: "Expire", segundos: t.expirar, fase: "expirar", info });
        if (t.segurar2) p.push({ rotulo: "Segure vazio", segundos: t.segurar2, fase: "segurar", info });
      }
      break;
    case "tempo":
      for (let s = 1; s <= t.series; s++) {
        p.push({ rotulo: ex.nome, segundos: t.segundos, fase: "ativo", info: t.series > 1 ? `Série ${s}/${t.series}` : "Mantenha o foco" });
        if (s < t.series && t.descanso) p.push({ rotulo: "Descanso", segundos: t.descanso, fase: "descanso", info: `Próxima: série ${s + 1}` });
      }
      break;
    case "reps":
      for (let s = 1; s <= t.series; s++) {
        p.push({ rotulo: `${t.reps} repetições`, segundos: null, fase: "manual", info: `Série ${s}/${t.series}`, botao: "Série feita" });
        if (s < t.series && t.descanso) p.push({ rotulo: "Descanso", segundos: t.descanso, fase: "descanso", info: `Próxima: série ${s + 1}` });
      }
      break;
    case "ciclos": {
      const aperto = ex.id === "aperto";
      for (let c = 1; c <= t.ciclos; c++) {
        const info = `Ciclo ${c}/${t.ciclos}`;
        if (c < t.ciclos) {
          p.push({ rotulo: "Estimule até o nível 7", segundos: null, fase: "manual", info, botao: "Cheguei no 7" });
          p.push({ rotulo: aperto ? "Aperte e respire" : "Pare e respire", segundos: t.pausa, fase: "pausa", info: "Deixe a excitação cair para 4 ou 5" });
        } else {
          p.push({ rotulo: "Ciclo final", segundos: null, fase: "manual", info: "Agora você pode concluir quando quiser", botao: "Concluir" });
        }
      }
      break;
    }
  }
  return p;
}

let audio: AudioContext | null = null;
function bip(freq = 660) {
  try {
    audio ??= new AudioContext();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.12, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.25);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.26);
  } catch {
    /* sem áudio */
  }
}

const corFase: Record<Fase, string> = {
  contrair: "from-accent to-accent-2",
  relaxar: "from-sky-400/60 to-indigo-400/50",
  inspirar: "from-accent to-accent-2",
  segurar: "from-amber-300/80 to-accent/70",
  expirar: "from-sky-400/60 to-indigo-400/50",
  descanso: "from-slate-500/60 to-slate-600/50",
  ativo: "from-accent to-accent-2",
  manual: "from-accent to-accent-2",
  pausa: "from-amber-300/80 to-rose-400/60",
};

function escala(f: Fase) {
  switch (f) {
    case "contrair": return 0.7;
    case "inspirar": return 1;
    case "segurar": return 1;
    case "expirar": return 0.55;
    case "relaxar": return 1;
    default: return 0.85;
  }
}

export function Player({ ex, onConcluir }: { ex: Exercicio; onConcluir?: () => void }) {
  const { som, vibrar } = useStore();
  const passos = useMemo(() => montarPassos(ex), [ex]);
  const [i, setI] = useState(0);
  const [restante, setRestante] = useState(passos[0]?.segundos ?? 0);
  const [rodando, setRodando] = useState(false);
  const [fim, setFim] = useState(false);
  const fimEm = useRef<number>(0);
  const passo = passos[i];

  const irPara = (k: number) => {
    if (k >= passos.length) {
      setRodando(false);
      setFim(true);
      if (som) bip(880);
      onConcluir?.();
      return;
    }
    setI(k);
    const s = passos[k].segundos;
    setRestante(s ?? 0);
    if (s != null) fimEm.current = Date.now() + s * 1000;
    if (som) bip(passos[k].fase === "contrair" || passos[k].fase === "inspirar" ? 760 : 520);
    if (vibrar) navigator.vibrate?.(passos[k].fase === "contrair" ? 120 : 50);
  };

  useEffect(() => {
    if (!rodando || !passo || passo.segundos == null) return;
    const t = setInterval(() => {
      const r = (fimEm.current - Date.now()) / 1000;
      if (r <= 0) irPara(i + 1);
      else setRestante(r);
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rodando, i]);

  const alternar = () => {
    if (fim) return reiniciar();
    if (!rodando && passo.segundos != null) fimEm.current = Date.now() + restante * 1000;
    if (!rodando && i === 0 && som) bip(760);
    setRodando(!rodando);
  };
  const reiniciar = () => {
    setFim(false);
    setRodando(false);
    setI(0);
    setRestante(passos[0]?.segundos ?? 0);
  };

  const progresso = fim ? 1 : i / passos.length;
  const dur = passo?.segundos ?? 0.6;
  const respira = ex.timer.tipo === "respiracao";

  return (
    <div className="card p-5">
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>{fim ? "Concluído" : passo?.info}</span>
        <span>{Math.round(progresso * 100)}%</span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-accent transition-all" style={{ width: `${progresso * 100}%` }} />
      </div>

      <div className="relative mx-auto grid aspect-square w-64 max-w-full place-items-center">
        <div className="absolute inset-0 rounded-full border border-line" />
        <div
          className={`absolute inset-4 rounded-full bg-gradient-to-br ${fim ? "from-accent to-accent-2" : corFase[passo.fase]} opacity-90 shadow-[0_0_60px_-10px] shadow-accent/50`}
          style={{
            transform: `scale(${rodando || fim ? (fim ? 1 : escala(passo.fase)) : 0.85})`,
            transition: `transform ${respira && rodando ? dur : 0.5}s ${respira ? "ease-in-out" : "cubic-bezier(.2,.7,.2,1)"}`,
          }}
        />
        <div className="relative text-center text-bg">
          {fim ? (
            <>
              <Check size={48} className="mx-auto" />
              <div className="mt-1 font-display text-xl font-bold">Muito bem!</div>
            </>
          ) : (
            <>
              <div className="font-display text-lg font-bold leading-tight px-6">{passo.rotulo}</div>
              {passo.segundos != null && <div className="font-display text-5xl font-bold tabular-nums">{Math.ceil(restante)}</div>}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={reiniciar} className="grid h-12 w-12 place-items-center rounded-full bg-surface-2" aria-label="Reiniciar">
          <RotateCcw size={20} />
        </button>
        {passo?.segundos == null && !fim ? (
          <button onClick={() => { setRodando(true); irPara(i + 1); }} className="btn-primary h-14 min-w-[180px] rounded-full text-base">
            {passo?.botao ?? "Próximo"}
          </button>
        ) : (
          <button onClick={alternar} className="btn-primary h-14 min-w-[180px] rounded-full text-base">
            {fim ? <><RotateCcw size={20} /> Repetir</> : rodando ? <><Pause size={20} /> Pausar</> : <><Play size={20} /> {i === 0 ? "Começar" : "Continuar"}</>}
          </button>
        )}
        <button onClick={() => irPara(i + 1)} disabled={fim} className="grid h-12 w-12 place-items-center rounded-full bg-surface-2" aria-label="Pular">
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}
