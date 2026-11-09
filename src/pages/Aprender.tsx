import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Header } from "@/components/ui";
import { Img } from "@/components/Img";
import { artigos } from "@/lib/data";

export default function Aprender() {
  return (
    <div className="animate-fade-up">
      <Header titulo="Aprenda" />
      <div className="space-y-3">
        {artigos.map((a) => (
          <Link key={a.id} to={`/aprender/${a.id}`} className="card flex gap-3 overflow-hidden p-2 pr-4">
            <Img src={a.imagem} alt={a.titulo} className="h-20 w-24 shrink-0 rounded-xl" icon={<BookOpen size={28} />} />
            <div className="min-w-0 flex-1 py-1">
              <p className="font-semibold leading-snug">{a.titulo}</p>
              <p className="line-clamp-2 text-xs text-muted">{a.resumo}</p>
              <p className="mt-1 text-[11px] text-muted">{a.minutos} min</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
