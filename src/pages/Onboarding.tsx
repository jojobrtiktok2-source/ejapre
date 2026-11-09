import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Timer } from "lucide-react";
import { Img } from "@/components/Img";
import { useStore } from "@/lib/store";

const telas = [
  { img: "/images/onboarding/1-boas-vindas.webp", titulo: "Mais controle, mais confiança", texto: "Um programa de 30 dias com exercícios, respiração, alimentação e hábitos para você durar mais e aproveitar sem ansiedade.", icone: <Timer size={64} /> },
  { img: "/images/onboarding/2-ciencia.webp", titulo: "Baseado em evidências", texto: "Treino do assoalho pélvico, técnicas usadas por urologistas e terapeutas sexuais e controle da ansiedade. Sem promessas milagrosas.", icone: <ShieldCheck size={64} /> },
  { img: "/images/onboarding/3-privacidade.webp", titulo: "100% discreto", texto: "Seus dados ficam só no seu celular. O nome do app e as notificações não revelam nada.", icone: <Lock size={64} /> },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const [nome, setNome] = useState("");
  const { set } = useStore();
  const nav = useNavigate();
  const ultima = i === telas.length;

  const comecar = () => {
    set({ nome: nome.trim(), inicio: new Date().toISOString() });
    nav("/avaliacao");
  };

  return (
    <div className="flex min-h-screen flex-col py-6">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((k) => (
          <div key={k} className={`h-1 flex-1 rounded-full ${k <= i ? "bg-accent" : "bg-surface-2"}`} />
        ))}
      </div>
      {!ultima ? (
        <div key={i} className="flex flex-1 flex-col animate-fade-up">
          <Img src={telas[i].img} alt={telas[i].titulo} className="mt-8 aspect-square w-full rounded-3xl" icon={telas[i].icone} />
          <h1 className="h1 mt-8 text-3xl">{telas[i].titulo}</h1>
          <p className="mt-3 leading-relaxed text-muted">{telas[i].texto}</p>
          <div className="mt-auto pt-8">
            <button className="btn-primary w-full" onClick={() => setI(i + 1)}>Continuar</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col animate-fade-up">
          <Img src="/images/marca/logo.webp" alt="Domínio" className="mx-auto mt-12 h-24 w-24 rounded-3xl" icon={<ShieldCheck />} />
          <h1 className="h1 mt-8 text-center text-3xl">Como podemos te chamar?</h1>
          <p className="mt-2 text-center text-muted">Pode ser um apelido. Fica só no seu aparelho.</p>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome ou apelido"
            className="mt-8 w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-ink outline-none focus:border-accent"
          />
          <div className="card mt-6 p-4 text-xs leading-relaxed text-muted">
            Este app é educativo e não substitui consulta médica. Se você tem dor, sangue no sêmen, problemas de ereção ou o problema começou de repente, procure um urologista.
          </div>
          <div className="mt-auto pt-8">
            <button className="btn-primary w-full" onClick={comecar}>Fazer minha avaliação</button>
          </div>
        </div>
      )}
    </div>
  );
}
