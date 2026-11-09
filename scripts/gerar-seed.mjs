// Gera database/seed.sql a partir dos JSON de src/data (fonte única do conteúdo).
// Uso: npm run db:seed
import fs from "node:fs";
import path from "node:path";

const raiz = path.resolve(import.meta.dirname, "..");
const ler = (f) => JSON.parse(fs.readFileSync(path.join(raiz, "src/data", f), "utf8"));

const q = (v) => {
  if (v === undefined || v === null) return "null";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return `'${String(v).replace(/'/g, "''")}'`;
};
const j = (v) => (v === undefined || v === null ? "null" : `${q(JSON.stringify(v))}::jsonb`);
const arr = (v) => `array[${v.map(q).join(",")}]::text[]`;

const linhas = ["-- Gerado por scripts/gerar-seed.mjs. Não edite à mão.", "begin;", ""];
const upsert = (tabela, colunas, valores, chave) => {
  const atualiza = colunas.filter((c) => !chave.includes(c)).map((c) => `${c} = excluded.${c}`).join(", ");
  linhas.push(
    `insert into ${tabela} (${colunas.join(", ")}) values (${valores.join(", ")}) on conflict (${chave.join(", ")}) do ${atualiza ? `update set ${atualiza}` : "nothing"};`,
  );
};

const exercicios = ler("exercicios.json");
for (const e of exercicios)
  upsert(
    "exercicios",
    ["id", "nome", "categoria", "nivel", "duracao_min", "objetivo", "por_que_ajuda", "passos", "dicas", "erros", "imagem", "frames", "timer"],
    [q(e.id), q(e.nome), q(e.categoria), q(e.nivel), q(e.duracaoMin), q(e.objetivo), q(e.porQueAjuda), j(e.passos), j(e.dicas), j(e.erros), q(e.imagem), j(e.frames), j(e.timer)],
    ["id"],
  );

const ali = ler("alimentacao.json");
linhas.push("");
for (const n of ali.nutrientes) upsert("nutrientes", ["id", "nome", "papel", "meta", "fontes"], [q(n.id), q(n.nome), q(n.papel), q(n.meta), j(n.fontes)], ["id"]);
for (const a of ali.alimentos) upsert("alimentos", ["id", "nome", "porque", "imagem", "nutrientes"], [q(a.id), q(a.nome), q(a.porque), q(a.imagem), arr(a.nutrientes)], ["id"]);
for (const e of ali.evitar) upsert("alimentos_evitar", ["nome", "porque"], [q(e.nome), q(e.porque)], ["nome"]);
for (const r of ali.receitas)
  upsert("receitas", ["id", "nome", "tempo", "imagem", "beneficio", "ingredientes", "preparo"], [q(r.id), q(r.nome), q(r.tempo), q(r.imagem), q(r.beneficio), j(r.ingredientes), j(r.preparo)], ["id"]);
for (const c of ali.cardapio) c.refeicoes.forEach((r, i) => upsert("cardapio", ["dia", "ordem", "tipo", "prato"], [q(c.dia), q(i + 1), q(r.tipo), q(r.prato)], ["dia", "ordem"]));

linhas.push("");
for (const h of ler("habitos.json"))
  upsert("habitos", ["id", "nome", "icone", "categoria", "porque", "como_fazer", "imagem"], [q(h.id), q(h.nome), q(h.icone), q(h.categoria), q(h.porque), j(h.comoFazer), q(h.imagem)], ["id"]);

linhas.push("");
for (const a of ler("artigos.json"))
  upsert("artigos", ["id", "titulo", "resumo", "minutos", "imagem", "secoes"], [q(a.id), q(a.titulo), q(a.resumo), q(a.minutos), q(a.imagem), j(a.secoes)], ["id"]);

const prog = ler("programa.json");
linhas.push("");
for (const f of prog.fases) upsert("programa_fases", ["semana", "nome", "descricao", "imagem"], [q(f.semana), q(f.nome), q(f.descricao), q(f.imagem)], ["semana"]);
for (const d of prog.dias)
  upsert("programa_dias", ["dia", "semana", "titulo", "dica", "artigo_id", "exercicios"], [q(d.dia), q(d.semana), q(d.titulo), q(d.dica), q(d.artigo), arr(d.exercicios)], ["dia"]);
for (const c of prog.conquistas) upsert("conquistas", ["id", "nome", "descricao", "imagem"], [q(c.id), q(c.nome), q(c.descricao), q(c.imagem)], ["id"]);

linhas.push("", "commit;", "");
const destino = path.join(raiz, "database/seed.sql");
fs.writeFileSync(destino, linhas.join("\n"));
console.log(`seed.sql gerado: ${linhas.length} linhas -> ${destino}`);
