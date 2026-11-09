# Domínio: controle e confiança

App (PWA, React + Vite + Tailwind) para homens que querem tratar a ejaculação precoce com exercícios, respiração, alimentação e hábitos. O nome e o ícone são discretos de propósito.

## Rodar

```bash
npm install
npm run dev
```

## O que tem

| Área | Conteúdo | Arquivo |
|---|---|---|
| Programa | 30 dias em 4 fases (Consciência, Força, Controle, Domínio) | `src/data/programa.json` |
| Exercícios | 32 com cronômetro guiado: Kegel (5 variações), respiração (3), técnicas (escala, para e recomeça, aperto, foco sensorial), corpo e alongamento (20 com fotos animadas) | `src/data/exercicios.json` |
| Nutrição | 7 nutrientes, 18 alimentos aliados, 6 itens a evitar, cardápio de 7 dias, 5 receitas, suplementos | `src/data/alimentacao.json` |
| Hábitos | 12 hábitos com explicação e rastreador diário | `src/data/habitos.json` |
| Aprender | 8 artigos | `src/data/artigos.json` |
| Autoavaliação | 5 perguntas (0 a 20) + tempo médio | `src/data/quiz.json` |
| Progresso | Diário (solo/parceria), gráfico, conquistas, histórico da avaliação | |

Os dados do usuário ficam no `localStorage` do aparelho.

## Imagens

- **Fotos de exercícios de corpo e alongamento**: banco [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (domínio público), já baixadas em `public/exercicios/`. São 2 quadros por exercício que o app alterna como se fosse um GIF.
- **Demais imagens**: veja `PROMPTS-IMAGENS.md` (79 prompts, com o caminho de cada arquivo). Enquanto não existirem, o app mostra um degradê no lugar.

## Especialista Domínio (chat com IA)

Aba **Especialista**: chat com o **Claude Haiku 5.5** (`claude-haiku-5-5`), especializado em ejaculação precoce.

- O "treinamento" está em `api/_conhecimento.ts`: persona e limites de segurança, uma base médica sobre EP (definições, causas, tratamentos, hora H, parceria, sinais de alerta) e todo o conteúdo do app (exercícios, artigos, programa, nutrição). Vai como system prompt com cache, então as mensagens seguintes custam pouco.
- O endpoint fica em `api/chat.ts` (rota `/api/chat`). Ele responde em streaming, limita as mensagens por IP e recebe o contexto do usuário (dia do programa, sequência, nota da avaliação).
- O Especialista pode colocar botões nas respostas (`[[ex:id]]`, `[[artigo:id]]`, `[[tela:x]]`) que abrem a tela certa do app.
- A chave da API fica **só no servidor**. Para rodar: copie `.env.example` para `.env.local` e preencha `ANTHROPIC_API_KEY`. Na Vercel, cadastre a mesma variável em Settings → Environment Variables.

## Banco de dados (Supabase / PostgreSQL)

1. Rode `database/schema.sql` no SQL Editor do Supabase.
2. Rode `database/seed.sql` (para gerar de novo depois de editar os JSON: `npm run db:seed`).

As tabelas de conteúdo têm leitura pública. As tabelas do usuário (`perfis`, `treinos`, `habitos_registro`, `diario`, `avaliacoes`, `dias_concluidos`) usam RLS: cada pessoa só acessa os próprios dados. Hoje o app usa o `localStorage`. O banco fica pronto para quando você quiser login e sincronização.

> Aviso: o app é educativo e não substitui avaliação médica.
