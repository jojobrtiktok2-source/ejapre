import { useEffect, useState } from "react";

/**
 * Acompanha o teclado virtual no celular.
 * - Marca <html data-teclado="aberto"> enquanto um campo de texto está em foco (esconde o menu de baixo).
 * - Expõe --teclado com a altura que o teclado cobre (iPhone). No Android, com
 *   interactive-widget=resizes-content, a própria janela encolhe e o valor fica 0.
 */
export function useTeclado() {
  useEffect(() => {
    const html = document.documentElement;
    const vv = window.visualViewport;
    const ehCampo = (el: Element | null) => !!el && (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && !["range", "checkbox", "radio", "button"].includes((el as HTMLInputElement).type)));
    const toque = window.matchMedia("(pointer: coarse)").matches;

    const atualizar = () => {
      const coberto = vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;
      html.style.setProperty("--teclado", `${Math.round(coberto)}px`);
      const aberto = toque && ehCampo(document.activeElement);
      if (aberto) html.dataset.teclado = "aberto";
      else delete html.dataset.teclado;
    };

    vv?.addEventListener("resize", atualizar);
    vv?.addEventListener("scroll", atualizar);
    document.addEventListener("focusin", atualizar);
    document.addEventListener("focusout", () => setTimeout(atualizar, 50));
    atualizar();
    return () => {
      vv?.removeEventListener("resize", atualizar);
      vv?.removeEventListener("scroll", atualizar);
      document.removeEventListener("focusin", atualizar);
    };
  }, []);
}

type Plataforma = "ios" | "android" | "outro";

export function plataforma(): Plataforma {
  const ua = navigator.userAgent;
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || iPadOS) return "ios";
  if (/Android/.test(ua)) return "android";
  return "outro";
}

export function instalado() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

interface EventoInstalar extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// O Chrome dispara este evento uma vez; guardamos para usar quando o usuário tocar em "Instalar".
let eventoGuardado: EventoInstalar | null = null;
const ouvintes = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    eventoGuardado = e as EventoInstalar;
    ouvintes.forEach((f) => f());
  });
  window.addEventListener("appinstalled", () => {
    eventoGuardado = null;
    ouvintes.forEach((f) => f());
  });
}

/** Estado da instalação do app (tela inicial). */
export function useInstalar() {
  const [, forcar] = useState(0);
  useEffect(() => {
    const f = () => forcar((n) => n + 1);
    ouvintes.add(f);
    return () => {
      ouvintes.delete(f);
    };
  }, []);
  const plat = plataforma();
  return {
    plataforma: plat,
    jaInstalado: instalado(),
    podeInstalarDireto: !!eventoGuardado,
    instalar: async () => {
      if (!eventoGuardado) return false;
      await eventoGuardado.prompt();
      const r = await eventoGuardado.userChoice;
      eventoGuardado = null;
      return r.outcome === "accepted";
    },
  };
}
