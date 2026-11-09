import { Link } from "react-router-dom";
import { Flame, Wind, Zap, LifeBuoy, Settings, ChevronRight, Play, BookOpen, MessageCircle } from "lucide-react";
import { Img, iconeFase } from "@/components/Img";
import { ConviteInstalar } from "@/components/Instalar";
import { Barra, Secao } from "@/components/ui";
import { artigos, exercicioPorId, programa } from "@/lib/data";
import { hoje, useStore } from "@/lib/store";

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export default function Inicio() {
  const s = useStore();
  const dia = programa.dias.find((d) => d.dia === s.diaAtual)!;
  const fase = programa.fases.find((f) => f.semana === dia.semana)!;
  const feitoHoje = s.diasConcluidos.includes(dia.dia);
  const habitosHoje = (s.habitos[hoje()] ?? []).filter((h) => s.habitosAtivos.includes(h)).length;
  const minutos = dia.exercicios.reduce((a, id) => a + (exercicioPorId(id)?.duracaoMin ?? 0), 0);

  return (
    <div className="pt-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{saudacao()}{s.nome ? "," : ""}</p>
          <h1 className="h1">{s.nome || "Bem-vindo"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className={`chip ${s.sequencia ? "border-warn/40 bg-warn/10 text-warn" : ""}`}>
            <Flame size={14} /> {s.sequencia} {s.sequencia === 1 ? "dia" : "dias"}
          </div>
          <Link to="/ajustes" className="grid h-9 w-9 place-items-center rounded-full bg-surface-2" aria-label="Ajustes">
            <Settings size={18} />
          </Link>
        </div>
      </div>

      <Link to={`/programa/${dia.dia}`} className="card mt-5 block overflow-hidden">
        <div className="relative">
          <Img src={fase.imagem} alt={fase.nome} className="aspect-[16/10] w-full" icon={iconeFase[fase.semana]} iconTop />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <p className="label text-accent">Semana {dia.semana} · {fase.nome}</p>
            <h2 className="font-display text-2xl font-bold">Dia {dia.dia}: {dia.titulo}</h2>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm leading-relaxed text-muted">{dia.dica}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted">{dia.exercicios.length} exercícios · ~{minutos} min</span>
            <span className={feitoHoje ? "chip-on" : "btn-primary px-4 py-2 text-sm"}>
              {feitoHoje ? "Concluído" : <><Play size={16} /> Treinar</>}
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/programa" className="card p-4">
          <p className="label">Programa</p>
          <p className="mt-1 font-display text-2xl font-bold">{s.diasConcluidos.length}<span className="text-base text-muted">/30</span></p>
          <Barra valor={s.diasConcluidos.length / 30} className="mt-2" />
        </Link>
        <Link to="/habitos" className="card p-4">
          <p className="label">Hábitos hoje</p>
          <p className="mt-1 font-display text-2xl font-bold">{habitosHoje}<span className="text-base text-muted">/{s.habitosAtivos.length}</span></p>
          <Barra valor={s.habitosAtivos.length ? habitosHoje / s.habitosAtivos.length : 0} className="mt-2" />
        </Link>
      </div>

      <ConviteInstalar />

      <Link to="/coach" className="card mt-4 flex items-center gap-3 overflow-hidden p-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-bg" style={{ backgroundImage: "linear-gradient(135deg,#2DD4BF,#38BDF8)" }}>
          <MessageCircle size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Fale com o Especialista</p>
          <p className="truncate text-xs text-muted">Orientação profissional, sigilosa e sem julgamento</p>
        </div>
        <ChevronRight className="text-muted" />
      </Link>

      <Secao titulo="Ferramentas rápidas">
        <div className="grid grid-cols-3 gap-3">
          <Link to="/exercicio/respiracao-diafragmatica" className="card flex flex-col items-center gap-2 p-4 text-center">
            <Wind className="text-accent" /> <span className="text-xs font-medium">Respirar agora</span>
          </Link>
          <Link to="/exercicio/kegel-basico" className="card flex flex-col items-center gap-2 p-4 text-center">
            <Zap className="text-accent" /> <span className="text-xs font-medium">Kegel rápido</span>
          </Link>
          <Link to="/aprender/na-hora" className="card flex flex-col items-center gap-2 p-4 text-center">
            <LifeBuoy className="text-warn" /> <span className="text-xs font-medium">SOS na hora H</span>
          </Link>
        </div>
      </Secao>

      <Secao titulo="Aprenda" acao={<Link to="/aprender" className="text-sm text-accent">Ver tudo</Link>}>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {artigos.slice(0, 5).map((a) => (
            <Link key={a.id} to={`/aprender/${a.id}`} className="card w-56 shrink-0 overflow-hidden">
              <Img src={a.imagem} alt={a.titulo} className="aspect-[16/10] w-full" icon={<BookOpen size={32} />} />
              <div className="p-3">
                <p className="text-sm font-semibold leading-snug">{a.titulo}</p>
                <p className="mt-1 text-xs text-muted">{a.minutos} min de leitura</p>
              </div>
            </Link>
          ))}
        </div>
      </Secao>

      <Link to="/progresso" className="card mt-6 flex items-center gap-3 p-4">
        <div className="flex-1">
          <p className="font-semibold">Registrar no diário</p>
          <p className="text-xs text-muted">Anote seus treinos solo e relações para ver a evolução.</p>
        </div>
        <ChevronRight className="text-muted" />
      </Link>
    </div>
  );
}
