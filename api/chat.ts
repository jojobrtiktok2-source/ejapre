// POST /api/chat — Especialista Domínio (Claude Haiku 5.5), resposta em streaming de texto.
import Anthropic from "@anthropic-ai/sdk";
import { CONHECIMENTO } from "./_conhecimento";

const MODELO = "claude-haiku-5-5";
const MAX_MENSAGENS = 24; // histórico enviado por requisição
const MAX_CARACTERES = 2000; // por mensagem do usuário
const LIMITE = { janelaMs: 10 * 60_000, max: 40 }; // por IP

// Criado na primeira mensagem: lê ANTHROPIC_API_KEY do ambiente (.env.local em dev, variáveis da Vercel em produção).
let client: Anthropic | null = null;

const acessos = new Map<string, number[]>();
function limitado(ip: string) {
  const agora = Date.now();
  const lista = (acessos.get(ip) ?? []).filter((t) => agora - t < LIMITE.janelaMs);
  lista.push(agora);
  acessos.set(ip, lista);
  return lista.length > LIMITE.max;
}

interface Contexto {
  nome?: string;
  dia?: number;
  diasConcluidos?: number;
  sequencia?: number;
  pontos?: number | null;
  tempo?: string | null;
}

function textoContexto(c: Contexto) {
  const linhas = [
    "# Situação atual do usuário (dados do app, use para personalizar sem repetir tudo)",
    c.nome ? `Nome: ${String(c.nome).slice(0, 40)}` : "Nome: não informado",
    `Programa: no dia ${Number(c.dia) || 1} de 30, ${Number(c.diasConcluidos) || 0} dias concluídos`,
    `Dias seguidos treinando: ${Number(c.sequencia) || 0}`,
    c.pontos != null ? `Última autoavaliação: ${Number(c.pontos)}/20 (quanto maior, mais sinais de EP)` : "Ainda não fez a autoavaliação",
    c.tempo ? `Tempo médio informado: ${String(c.tempo).slice(0, 40)}` : "",
  ];
  return linhas.filter(Boolean).join("\n");
}

function validar(corpo: unknown): { mensagens: Anthropic.MessageParam[]; contexto: Contexto } | string {
  if (!corpo || typeof corpo !== "object") return "Requisição inválida.";
  const { messages, contexto } = corpo as { messages?: unknown; contexto?: Contexto };
  if (!Array.isArray(messages) || messages.length === 0) return "Envie ao menos uma mensagem.";
  const recentes = messages.slice(-MAX_MENSAGENS);
  // a conversa enviada precisa começar com o usuário
  while (recentes.length && (recentes[0] as { role?: string }).role !== "user") recentes.shift();
  const mensagens: Anthropic.MessageParam[] = [];
  for (const m of recentes) {
    const { role, content } = m as { role?: string; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string" || !content.trim()) return "Mensagem inválida.";
    if (role === "user" && content.length > MAX_CARACTERES) return `Mensagem muito longa (máximo ${MAX_CARACTERES} caracteres).`;
    mensagens.push({ role, content: content.slice(0, 8000) });
  }
  if (mensagens.at(-1)?.role !== "user") return "A última mensagem deve ser do usuário.";
  return { mensagens, contexto: contexto ?? {} };
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limitado(ip)) return new Response("Muitas mensagens em pouco tempo. Respire fundo e tente de novo em alguns minutos.", { status: 429 });

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return new Response("Requisição inválida.", { status: 400 });
  }
  const v = validar(corpo);
  if (typeof v === "string") return new Response(v, { status: 400 });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enviar = (t: string) => controller.enqueue(encoder.encode(t));
      try {
        try {
          client ??= new Anthropic();
        } catch {
          enviar("O Especialista ainda não foi configurado: falta a chave ANTHROPIC_API_KEY no servidor.");
          return;
        }
        const stream = client.messages.stream({
          model: MODELO,
          max_tokens: 8000,
          output_config: { effort: "low" }, // chat: respostas rápidas e diretas
          system: [
            { type: "text", text: CONHECIMENTO, cache_control: { type: "ephemeral" } }, // base fixa, em cache
            { type: "text", text: textoContexto(v.contexto) }, // muda por usuário, depois do cache
          ],
          messages: v.mensagens,
        });

        for await (const evento of stream) {
          if (evento.type === "content_block_delta" && evento.delta.type === "text_delta") enviar(evento.delta.text);
        }

        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          enviar("\n\nNão consigo responder isso por aqui. Se for algo de saúde, o melhor caminho é conversar com um urologista. [[artigo:quando-medico]]");
        } else if (final.stop_reason === "max_tokens") {
          enviar("\n\n(Resposta cortada. Peça para eu continuar.)");
        }
      } catch (err) {
        console.error("[chat]", err);
        if (err instanceof Anthropic.AuthenticationError) enviar("O Especialista ainda não foi configurado (chave da API ausente ou inválida).");
        else if (err instanceof Anthropic.RateLimitError) enviar("Muitas consultas ao mesmo tempo agora. Tente de novo em instantes.");
        else if (err instanceof Anthropic.APIConnectionError) enviar("O servidor não conseguiu falar com a IA agora. Tente de novo em instantes.");
        else if (err instanceof Anthropic.APIError) enviar("Tive um problema para responder agora. Tente de novo em instantes.");
        else if (err instanceof Anthropic.AnthropicError) enviar("O Especialista ainda não foi configurado: falta a chave ANTHROPIC_API_KEY no servidor.");
        else enviar("Não consegui me conectar. Verifique sua internet e tente de novo.");
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}
