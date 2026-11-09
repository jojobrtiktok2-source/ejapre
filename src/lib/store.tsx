import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Registro, ResultadoQuiz } from "./types";
import { programa } from "./data";

export const hoje = (d = new Date()) => {
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

interface Estado {
  nome: string;
  onboarded: boolean;
  inicio: string | null;
  diasConcluidos: number[];
  treinos: { data: string; id: string }[];
  habitos: Record<string, string[]>; // data -> ids
  habitosAtivos: string[];
  diario: Registro[];
  quiz: ResultadoQuiz[];
  lembrete: string; // HH:MM
  som: boolean;
  vibrar: boolean;
}

const inicial: Estado = {
  nome: "",
  onboarded: false,
  inicio: null,
  diasConcluidos: [],
  treinos: [],
  habitos: {},
  habitosAtivos: ["sono", "agua", "treino-pelvico", "movimento", "respiracao", "sem-pornografia"],
  diario: [],
  quiz: [],
  lembrete: "21:00",
  som: true,
  vibrar: true,
};

const CHAVE = "dominio:v1";

function carregar(): Estado {
  try {
    const raw = localStorage.getItem(CHAVE);
    return raw ? { ...inicial, ...JSON.parse(raw) } : inicial;
  } catch {
    return inicial;
  }
}

interface Store extends Estado {
  set: (p: Partial<Estado>) => void;
  concluirDia: (dia: number) => void;
  registrarTreino: (id: string) => void;
  alternarHabito: (id: string, data?: string) => void;
  salvarRegistro: (r: Registro) => void;
  removerRegistro: (id: string) => void;
  salvarQuiz: (r: ResultadoQuiz) => void;
  resetar: () => void;
  diaAtual: number;
  sequencia: number;
  conquistas: Set<string>;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Estado>(carregar);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(s));
    } catch {
      /* armazenamento indisponível */
    }
  }, [s]);

  const derivado = useMemo(() => {
    const diaAtual = Math.min(programa.dias.length, Math.max(0, ...s.diasConcluidos) + 1);
    // sequência: dias seguidos (até hoje ou ontem) com pelo menos um treino
    const datas = new Set(s.treinos.map((t) => t.data));
    let sequencia = 0;
    const d = new Date();
    if (!datas.has(hoje(d))) d.setDate(d.getDate() - 1);
    while (datas.has(hoje(d))) {
      sequencia++;
      d.setDate(d.getDate() - 1);
    }
    const c = new Set<string>();
    if (s.treinos.length > 0) c.add("primeiro-treino");
    const semana = (w: number) => programa.dias.filter((x) => x.semana === w).every((x) => s.diasConcluidos.includes(x.dia));
    [1, 2, 3].forEach((w) => semana(w) && c.add(`semana-${w}`));
    if (s.diasConcluidos.length >= programa.dias.length) c.add("semana-4");
    if (sequencia >= 7) c.add("sequencia-7");
    if (Object.values(s.habitos).reduce((a, v) => a + v.length, 0) >= 100) c.add("habitos-100");
    if (s.diario.length >= 10) c.add("diario-10");
    return { diaAtual, sequencia, conquistas: c };
  }, [s]);

  const store: Store = {
    ...s,
    ...derivado,
    set: (p) => setS((o) => ({ ...o, ...p })),
    concluirDia: (dia) =>
      setS((o) => ({ ...o, diasConcluidos: o.diasConcluidos.includes(dia) ? o.diasConcluidos : [...o.diasConcluidos, dia] })),
    registrarTreino: (id) =>
      setS((o) => {
        const data = hoje();
        const habitosDia = o.habitos[data] ?? [];
        const marcaPelvico = ["assoalho", "kegel"].some((k) => id.includes(k)) && !habitosDia.includes("treino-pelvico");
        return {
          ...o,
          treinos: [...o.treinos, { data, id }],
          habitos: marcaPelvico ? { ...o.habitos, [data]: [...habitosDia, "treino-pelvico"] } : o.habitos,
        };
      }),
    alternarHabito: (id, data = hoje()) =>
      setS((o) => {
        const atual = o.habitos[data] ?? [];
        const novo = atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id];
        return { ...o, habitos: { ...o.habitos, [data]: novo } };
      }),
    salvarRegistro: (r) => setS((o) => ({ ...o, diario: [r, ...o.diario.filter((x) => x.id !== r.id)] })),
    removerRegistro: (id) => setS((o) => ({ ...o, diario: o.diario.filter((x) => x.id !== id) })),
    salvarQuiz: (r) => setS((o) => ({ ...o, quiz: [...o.quiz, r] })),
    resetar: () => setS(inicial),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore fora do provider");
  return c;
}
