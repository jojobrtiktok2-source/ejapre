import exerciciosJson from "@/data/exercicios.json";
import alimentacaoJson from "@/data/alimentacao.json";
import habitosJson from "@/data/habitos.json";
import artigosJson from "@/data/artigos.json";
import programaJson from "@/data/programa.json";
import quizJson from "@/data/quiz.json";
import type { Categoria, Dia, Exercicio } from "./types";

export const exercicios = exerciciosJson as Exercicio[];
export const exercicioPorId = (id: string) => exercicios.find((e) => e.id === id);
export const alimentacao = alimentacaoJson;
export const habitos = habitosJson;
export const artigos = artigosJson;
export const artigoPorId = (id: string) => artigos.find((a) => a.id === id);
export const programa = programaJson as { fases: typeof programaJson.fases; dias: Dia[]; conquistas: typeof programaJson.conquistas };
export const quiz = quizJson;

export const categorias: { id: Categoria; nome: string; descricao: string; imagem: string }[] = [
  { id: "assoalho", nome: "Assoalho pélvico", descricao: "Kegel e Kegel reverso", imagem: "/images/categorias/assoalho.webp" },
  { id: "respiracao", nome: "Respiração", descricao: "Calma e controle da ansiedade", imagem: "/images/categorias/respiracao.webp" },
  { id: "tecnica", nome: "Técnicas de controle", descricao: "Escala, para e recomeça, aperto", imagem: "/images/categorias/tecnicas.webp" },
  { id: "corpo", nome: "Corpo e cardio", descricao: "Força, core e circulação", imagem: "/images/categorias/corpo.webp" },
  { id: "alongamento", nome: "Alongamento", descricao: "Soltar quadril e pelve", imagem: "/images/categorias/alongamento.webp" },
];

export const nomeCategoria = (c: Categoria) => categorias.find((x) => x.id === c)?.nome ?? c;

export function duracaoTimer(e: Exercicio): number {
  const t = e.timer;
  switch (t.tipo) {
    case "intervalo": return t.series * t.reps * (t.contrair + t.relaxar) + (t.series - 1) * t.descanso;
    case "respiracao": return t.ciclos * (t.inspirar + t.segurar + t.expirar + t.segurar2);
    case "tempo": return t.series * t.segundos + (t.series - 1) * (t.descanso ?? 0);
    default: return e.duracaoMin * 60;
  }
}
