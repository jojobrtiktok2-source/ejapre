export type Categoria = "assoalho" | "respiracao" | "tecnica" | "corpo" | "alongamento";

export type Timer =
  | { tipo: "intervalo"; contrair: number; relaxar: number; reps: number; series: number; descanso: number; rotulos?: [string, string] }
  | { tipo: "respiracao"; inspirar: number; segurar: number; expirar: number; segurar2: number; ciclos: number }
  | { tipo: "tempo"; segundos: number; series: number; descanso?: number }
  | { tipo: "reps"; reps: number; series: number; descanso?: number }
  | { tipo: "ciclos"; ciclos: number; pausa: number };

export interface Exercicio {
  id: string;
  nome: string;
  categoria: Categoria;
  nivel: number;
  duracaoMin: number;
  objetivo: string;
  porQueAjuda: string;
  passos: string[];
  dicas: string[];
  erros: string[];
  imagem?: string;
  frames?: string[];
  timer: Timer;
}

export interface Dia {
  dia: number;
  semana: number;
  titulo: string;
  exercicios: string[];
  dica: string;
  artigo?: string;
}

export interface Registro {
  id: string;
  data: string; // ISO
  tipo: "solo" | "parceria";
  minutos: number;
  controle: number; // 1-5
  tecnicas: string[];
  notas: string;
}

export interface ResultadoQuiz {
  data: string;
  pontos: number;
  tempo: number;
}
