import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw, ShieldCheck, Sparkles, Square } from "lucide-react";
import { Img } from "@/components/Img";
import { Markdown } from "@/components/Markdown";
import { quiz } from "@/lib/data";
import { useStore } from "@/lib/store";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const CHAVE = "dominio:chat";
const sugestoes = [
  "Como sei se estou fazendo o Kegel certo?",
  "O que fazer na hora quando sinto que vou terminar?",
  "Isso tem cura? Quanto tempo leva para melhorar?",
  "Como falo disso com minha parceira?",
  "Quais alimentos ajudam?",
  "Quando devo procurar um médico?",
];

function carregar(): Msg[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
  } catch {
    return [];
  }
}

function Avatar({ size = 36 }: { size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Img src="/images/coach/avatar.webp" alt="Coach Domínio" className="h-full w-full rounded-full ring-2 ring-accent/40" icon={<Sparkles />} />
    </div>
  );
}

export default function Coach() {
  const s = useStore();
  const [msgs, setMsgs] = useState<Msg[]>(carregar);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const abortar = useRef<AbortController | null>(null);
  const fim = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(msgs.slice(-60)));
    } catch {
      /* sem armazenamento */
    }
  }, [msgs]);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  const enviar = async (conteudo: string) => {
    const t = conteudo.trim();
    if (!t || enviando) return;
    const historico: Msg[] = [...msgs, { role: "user", content: t }];
    setMsgs([...historico, { role: "assistant", content: "" }]);
    setTexto("");
    setEnviando(true);
    const ctrl = new AbortController();
    abortar.current = ctrl;
    const ultimo = s.quiz[s.quiz.length - 1];

    const escrever = (parcial: string) =>
      setMsgs((m) => {
        const copia = [...m];
        copia[copia.length - 1] = { role: "assistant", content: parcial };
        return copia;
      });

    let resposta = "";
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          messages: historico.filter((m) => m.content.trim()),
          contexto: {
            nome: s.nome,
            dia: s.diaAtual,
            diasConcluidos: s.diasConcluidos.length,
            sequencia: s.sequencia,
            pontos: ultimo?.pontos ?? null,
            tempo: ultimo ? quiz.tempo.opcoes[ultimo.tempo] : null,
          },
        }),
      });
      if (!r.ok || !r.body) {
        resposta = (await r.text()) || "Não consegui responder agora. Tente de novo.";
        escrever(resposta);
      } else {
        const leitor = r.body.getReader();
        const dec = new TextDecoder();
        for (;;) {
          const { done, value } = await leitor.read();
          if (done) break;
          resposta += dec.decode(value, { stream: true });
          escrever(resposta);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") escrever(resposta || "Sem conexão. Verifique sua internet e tente de novo.");
    } finally {
      setEnviando(false);
      abortar.current = null;
      // remove resposta vazia (ex.: parada antes de começar)
      setMsgs((m) => (m.at(-1)?.role === "assistant" && !m.at(-1)!.content.trim() ? m.slice(0, -1) : m));
    }
  };

  const limpar = () => {
    if (enviando) abortar.current?.abort();
    if (msgs.length && confirm("Apagar esta conversa?")) setMsgs([]);
  };

  const vazio = msgs.length === 0;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 -mx-4 flex items-center gap-3 border-b border-white/[0.05] bg-bg/75 px-4 py-3 backdrop-blur-xl">
        <Avatar size={40} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display font-semibold leading-tight">Coach Domínio</h1>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px] shadow-accent" /> Especialista em controle ejaculatório
          </p>
        </div>
        {!vazio && (
          <button onClick={limpar} className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.07] bg-surface-2/80 text-muted" aria-label="Nova conversa">
            <RotateCcw size={16} />
          </button>
        )}
      </header>

      <div className="flex-1 pb-44 pt-4">
        {vazio ? (
          <div className="animate-fade-up">
            <div className="flex flex-col items-center pt-6 text-center">
              <Avatar size={84} />
              <h2 className="h1 mt-4">Oi{s.nome ? `, ${s.nome}` : ""}! Sou seu coach.</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                Pergunte qualquer coisa sobre ejaculação precoce, exercícios, a hora H, alimentação ou como conversar com a parceria. Sem julgamentos.
              </p>
            </div>
            <div className="mt-6 grid gap-2">
              {sugestoes.map((q) => (
                <button key={q} onClick={() => enviar(q)} className="card px-4 py-3 text-left text-sm">
                  {q}
                </button>
              ))}
            </div>
            <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-accent" />
              O coach é uma IA educativa e não substitui o médico. A conversa fica salva só neste aparelho.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end animate-fade-up">
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md px-4 py-2.5 text-[15px] leading-relaxed text-bg" style={{ backgroundImage: "linear-gradient(135deg,#2DD4BF,#38BDF8)" }}>
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-2.5 animate-fade-up">
                  <Avatar size={28} />
                  <div className="card min-w-0 max-w-[88%] rounded-tl-md px-4 py-2.5">
                    {m.content ? (
                      <Markdown texto={m.content} />
                    ) : (
                      <div className="flex gap-1 py-2" aria-label="Digitando">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-accent/70" style={{ animationDelay: `${d * 0.15}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
        <div ref={fim} />
      </div>

      <div className="fixed inset-x-0 z-20 px-3" style={{ bottom: "calc(env(safe-area-inset-bottom) + 84px)" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviar(texto);
          }}
          className="mx-auto flex max-w-md items-end gap-2 rounded-2xl border border-white/[0.08] bg-surface/90 p-2 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl focus-within:border-accent/40"
        >
          <textarea
            ref={campo}
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviar(texto);
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder="Escreva sua dúvida..."
            className="max-h-[120px] min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-[15px] text-ink outline-none placeholder:text-muted"
          />
          {enviando ? (
            <button type="button" onClick={() => abortar.current?.abort()} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink" aria-label="Parar">
              <Square size={16} fill="currentColor" />
            </button>
          ) : (
            <button type="submit" disabled={!texto.trim()} className="btn-primary h-10 w-10 shrink-0 rounded-xl p-0" aria-label="Enviar">
              <ArrowUp size={20} strokeWidth={2.5} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
