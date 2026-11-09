import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Dumbbell, LayoutGrid } from "lucide-react";
import { artigoPorId, exercicioPorId } from "@/lib/data";

const telas: Record<string, { rota: string; nome: string }> = {
  programa: { rota: "/programa", nome: "Programa de 30 dias" },
  treinar: { rota: "/treinar", nome: "Exercícios" },
  nutricao: { rota: "/nutricao", nome: "Nutrição" },
  habitos: { rota: "/habitos", nome: "Hábitos" },
  progresso: { rota: "/progresso", nome: "Progresso" },
  avaliacao: { rota: "/avaliacao", nome: "Autoavaliação" },
};

/** Converte [[ex:id]], [[artigo:id]] e [[tela:x]] em botões que abrem o app. */
function botao(tipo: string, id: string, k: number): ReactNode {
  let rota = "", nome = "", Icone = LayoutGrid;
  if (tipo === "ex") {
    const e = exercicioPorId(id);
    if (!e) return null;
    rota = `/exercicio/${id}`; nome = e.nome; Icone = Dumbbell;
  } else if (tipo === "artigo") {
    const a = artigoPorId(id);
    if (!a) return null;
    rota = `/aprender/${id}`; nome = a.titulo; Icone = BookOpen;
  } else if (tipo === "tela" && telas[id]) {
    rota = telas[id].rota; nome = telas[id].nome;
  } else return null;
  return (
    <Link key={k} to={rota} className="my-1 mr-1.5 inline-flex max-w-full items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-2.5 py-1.5 align-middle text-xs font-semibold text-accent transition hover:bg-accent/20">
      <Icone size={14} className="shrink-0" />
      <span className="truncate">{nome}</span>
      <ChevronRight size={13} className="shrink-0 opacity-70" />
    </Link>
  );
}

function inline(texto: string, chave: string): ReactNode[] {
  const partes = texto.split(/(\*\*[^*]+\*\*|\[\[[a-z]+:[a-z0-9-]+\]\])/g);
  return partes.map((p, i) => {
    const k = `${chave}-${i}`;
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={k} className="font-semibold text-ink">{p.slice(2, -2)}</strong>;
    const m = p.match(/^\[\[([a-z]+):([a-z0-9-]+)\]\]$/);
    if (m) return <Fragment key={k}>{botao(m[1], m[2], i)}</Fragment>;
    return <Fragment key={k}>{p}</Fragment>;
  });
}

/** Markdown simples e seguro (sem HTML): parágrafos, listas, negrito e botões do app. */
export function Markdown({ texto }: { texto: string }) {
  const blocos: ReactNode[] = [];
  let lista: { tipo: "ul" | "ol"; itens: string[] } | null = null;
  const fecharLista = () => {
    if (!lista) return;
    const L = lista;
    const Tag = L.tipo;
    blocos.push(
      <Tag key={`l${blocos.length}`} className={`my-2 space-y-1.5 pl-5 ${L.tipo === "ol" ? "list-decimal" : "list-disc"} marker:text-accent`}>
        {L.itens.map((it, i) => <li key={i}>{inline(it, `li${blocos.length}-${i}`)}</li>)}
      </Tag>,
    );
    lista = null;
  };

  texto.split("\n").forEach((linha, n) => {
    const l = linha.trimEnd();
    const ul = l.match(/^\s*[-*•]\s+(.*)$/);
    const ol = l.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      const tipo = ul ? "ul" : "ol";
      if (!lista || lista.tipo !== tipo) { fecharLista(); lista = { tipo, itens: [] }; }
      lista.itens.push((ul ?? ol)![1]);
      return;
    }
    fecharLista();
    if (!l.trim()) return;
    const titulo = l.match(/^#{1,4}\s+(.*)$/);
    blocos.push(
      titulo
        ? <p key={`p${n}`} className="mt-3 font-semibold text-ink">{inline(titulo[1], `h${n}`)}</p>
        : <p key={`p${n}`} className="my-1.5">{inline(l, `p${n}`)}</p>,
    );
  });
  fecharLista();
  return <div className="text-[15px] leading-relaxed">{blocos}</div>;
}
