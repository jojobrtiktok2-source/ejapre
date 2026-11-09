import { useState } from "react";
import { createPortal } from "react-dom";
import { Download, PlusSquare, Share, Smartphone, X } from "lucide-react";
import { useInstalar } from "@/lib/mobile";

const CHAVE = "dominio:instalar-dispensado";

function lerDispensado() {
  try {
    return localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

/** Passo a passo para iPhone (o Safari não tem botão de instalar automático). */
export function GuiaIOS({ onFechar }: { onFechar: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={onFechar}>
      <div className="mx-auto w-full max-w-md rounded-t-3xl bg-surface p-5 animate-fade-up" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="h2">Instalar no iPhone</h2>
          <button onClick={onFechar} className="grid h-9 w-9 place-items-center rounded-full bg-surface-2" aria-label="Fechar"><X size={18} /></button>
        </div>
        <ol className="mt-4 space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"><Share size={18} /></span>
            <span>No <b>Safari</b>, toque em <b>Compartilhar</b> (o quadrado com a seta, na barra de baixo).</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"><PlusSquare size={18} /></span>
            <span>Role e toque em <b>Adicionar à Tela de Início</b>.</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"><Smartphone size={18} /></span>
            <span>Toque em <b>Adicionar</b>. O Domínio abre em tela cheia, como um app.</span>
          </li>
        </ol>
        <p className="mt-4 text-xs text-muted">Se estiver em outro navegador (Chrome, Instagram), abra o link no Safari primeiro.</p>
        <button className="btn-primary mt-5 w-full" onClick={onFechar}>Entendi</button>
      </div>
    </div>,
    document.body,
  );
}

/** Card discreto no Início convidando a instalar. Some se já está instalado ou se o usuário dispensou. */
export function ConviteInstalar() {
  const { plataforma, jaInstalado, podeInstalarDireto, instalar } = useInstalar();
  const [dispensado, setDispensado] = useState(lerDispensado);
  const [guia, setGuia] = useState(false);

  if (jaInstalado || dispensado) return null;
  if (plataforma === "outro" && !podeInstalarDireto) return null;
  if (plataforma === "android" && !podeInstalarDireto) return null;

  const dispensar = () => {
    setDispensado(true);
    try {
      localStorage.setItem(CHAVE, "1");
    } catch {
      /* sem armazenamento */
    }
  };

  return (
    <>
      <div className="card mt-4 flex items-center gap-3 p-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
          <Download size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Instale o app</p>
          <p className="text-xs text-muted">Abre em tela cheia, funciona sem internet e com ícone discreto.</p>
        </div>
        <button className="btn-primary px-3 py-2 text-sm" onClick={() => (podeInstalarDireto ? instalar() : setGuia(true))}>
          Instalar
        </button>
        <button onClick={dispensar} className="absolute right-2 top-2 text-muted" aria-label="Dispensar"><X size={14} /></button>
      </div>
      {guia && <GuiaIOS onFechar={() => setGuia(false)} />}
    </>
  );
}
