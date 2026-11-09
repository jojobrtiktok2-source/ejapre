import { useParams } from "react-router-dom";
import { ChefHat, Clock, Sparkles } from "lucide-react";
import { Header, Lista, Secao } from "@/components/ui";
import { Img } from "@/components/Img";
import { alimentacao } from "@/lib/data";

export default function Receita() {
  const { id } = useParams();
  const r = alimentacao.receitas.find((x) => x.id === id);
  if (!r) return <Header titulo="Receita não encontrada" />;
  return (
    <div className="animate-fade-up">
      <Header titulo={r.nome} />
      <Img src={r.imagem} alt={r.nome} className="aspect-[4/3] w-full rounded-2xl" icon={<ChefHat />} />
      <div className="mt-3 flex gap-2">
        <span className="chip"><Clock size={12} /> {r.tempo}</span>
      </div>
      <div className="card mt-4 flex gap-3 p-4 text-sm">
        <Sparkles size={18} className="shrink-0 text-accent" /> {r.beneficio}
      </div>
      <Secao titulo="Ingredientes">
        <Lista itens={r.ingredientes} />
      </Secao>
      <Secao titulo="Modo de preparo">
        <Lista itens={r.preparo} numerada />
      </Secao>
    </div>
  );
}
