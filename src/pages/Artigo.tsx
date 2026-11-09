import { Link, useParams } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { Header } from "@/components/ui";
import { Img } from "@/components/Img";
import { artigoPorId, artigos } from "@/lib/data";

export default function Artigo() {
  const { id } = useParams();
  const a = artigoPorId(id ?? "");
  if (!a) return <Header titulo="Artigo não encontrado" />;
  const idx = artigos.indexOf(a);
  const proximo = artigos[(idx + 1) % artigos.length];

  return (
    <div className="animate-fade-up">
      <Header titulo={a.titulo} />
      <Img src={a.imagem} alt={a.titulo} className="aspect-[16/9] w-full rounded-2xl" icon={<BookOpen size={40} />} />
      <p className="mt-4 text-muted">{a.resumo}</p>
      <div className="mt-6 space-y-6">
        {a.secoes.map((s) => (
          <section key={s.titulo}>
            <h2 className="h2">{s.titulo}</h2>
            <p className="mt-2 leading-relaxed text-ink/90">{s.texto}</p>
          </section>
        ))}
      </div>
      <Link to={`/aprender/${proximo.id}`} className="card mt-8 flex items-center gap-3 p-4">
        <div className="flex-1">
          <p className="label">Próxima leitura</p>
          <p className="font-medium">{proximo.titulo}</p>
        </div>
        <ChevronRight className="text-muted" />
      </Link>
    </div>
  );
}
