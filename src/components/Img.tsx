import { useEffect, useState, type ReactNode } from "react";
import { Activity, Dumbbell, HeartHandshake, ImageIcon, StretchHorizontal, Target, Wind } from "lucide-react";

const iconeCategoria: Record<string, ReactNode> = {
  assoalho: <Target />,
  respiracao: <Wind />,
  tecnica: <Activity />,
  corpo: <Dumbbell />,
  alongamento: <StretchHorizontal />,
  relacao: <HeartHandshake />,
};

/** Fundo bonito enquanto a imagem ainda não foi gerada (ver PROMPTS-IMAGENS.md). */
function Placeholder({ alt, icon, className, iconTop }: { alt: string; icon?: ReactNode; className: string; iconTop?: boolean }) {
  return (
    <div className={`placeholder relative isolate grid place-items-center overflow-hidden ${className}`} aria-label={alt} role="img">
      <div className="pointer-events-none absolute -left-1/4 -top-1/3 h-[90%] w-[90%] rounded-full bg-accent/25 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[80%] w-[80%] rounded-full bg-accent-2/20 blur-2xl" />
      <div className="placeholder-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className={`relative grid h-[38%] max-h-16 min-h-8 aspect-square ${iconTop ? "-translate-y-1/2" : ""} place-items-center rounded-2xl border border-white/10 bg-white/5 text-accent shadow-lg backdrop-blur-sm [&>svg]:h-1/2 [&>svg]:w-1/2`}>
        {icon ?? <ImageIcon />}
      </div>
    </div>
  );
}

export function Img({ src, alt, className = "", icon, iconTop }: { src?: string; alt: string; className?: string; icon?: ReactNode; iconTop?: boolean }) {
  const [erro, setErro] = useState(false);
  if (!src || erro) return <Placeholder alt={alt} icon={icon} className={className} iconTop={iconTop} />;
  return <img src={src} alt={alt} loading="lazy" onError={() => setErro(true)} className={`bg-surface-2 object-cover ${className}`} />;
}

/** Alterna os quadros do banco free-exercise-db para simular um GIF, com tratamento para combinar com o tema escuro. */
export function Frames({ frames, alt, className = "", intervalo = 900 }: { frames: string[]; alt: string; className?: string; intervalo?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % frames.length), intervalo);
    return () => clearInterval(t);
  }, [frames.length, intervalo]);
  return (
    <div className={`relative isolate overflow-hidden bg-surface-2 ${className}`}>
      {frames.map((f, k) => (
        <img
          key={f}
          src={f}
          alt={k === 0 ? alt : ""}
          className="foto-exercicio absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: k === i ? 1 : 0 }}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-bg/10" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
    </div>
  );
}

export function Midia({ ex, className = "" }: { ex: { nome: string; categoria?: string; imagem?: string; frames?: string[] }; className?: string }) {
  if (ex.frames?.length) return <Frames frames={ex.frames} alt={ex.nome} className={className} />;
  return <Img src={ex.imagem} alt={ex.nome} className={className} icon={ex.categoria ? iconeCategoria[ex.categoria] : undefined} />;
}

export const iconeFase: Record<number, ReactNode> = { 1: <Target />, 2: <Dumbbell />, 3: <Activity />, 4: <HeartHandshake /> };

export { iconeCategoria };
