-- =============================================================
-- Domínio: banco de dados (PostgreSQL / Supabase)
-- Rode este arquivo primeiro e depois o seed.sql (gerado com: npm run db:seed)
-- =============================================================

-- ---------- CONTEÚDO (leitura pública) ----------

create table if not exists exercicios (
  id            text primary key,
  nome          text not null,
  categoria     text not null check (categoria in ('assoalho','respiracao','tecnica','corpo','alongamento')),
  nivel         smallint not null check (nivel between 1 and 3),
  duracao_min   smallint not null,
  objetivo      text not null,
  por_que_ajuda text not null,
  passos        jsonb not null default '[]',
  dicas         jsonb not null default '[]',
  erros         jsonb not null default '[]',
  imagem        text,
  frames        jsonb,          -- quadros do free-exercise-db (animação)
  timer         jsonb not null  -- { tipo: intervalo|respiracao|tempo|reps|ciclos, ... }
);

create table if not exists nutrientes (
  id     text primary key,
  nome   text not null,
  papel  text not null,
  meta   text not null,
  fontes jsonb not null default '[]'
);

create table if not exists alimentos (
  id         text primary key,
  nome       text not null,
  porque     text not null,
  imagem     text,
  nutrientes text[] not null default '{}'
);

create table if not exists alimentos_evitar (
  nome   text primary key,
  porque text not null
);

create table if not exists receitas (
  id           text primary key,
  nome         text not null,
  tempo        text,
  imagem       text,
  beneficio    text,
  ingredientes jsonb not null default '[]',
  preparo      jsonb not null default '[]'
);

create table if not exists cardapio (
  dia       smallint not null,
  ordem     smallint not null,
  tipo      text not null,
  prato     text not null,
  primary key (dia, ordem)
);

create table if not exists habitos (
  id          text primary key,
  nome        text not null,
  icone       text,
  categoria   text,
  porque      text,
  como_fazer  jsonb not null default '[]',
  imagem      text
);

create table if not exists artigos (
  id      text primary key,
  titulo  text not null,
  resumo  text,
  minutos smallint,
  imagem  text,
  secoes  jsonb not null default '[]'
);

create table if not exists programa_fases (
  semana    smallint primary key,
  nome      text not null,
  descricao text,
  imagem    text
);

create table if not exists programa_dias (
  dia        smallint primary key,
  semana     smallint not null references programa_fases(semana),
  titulo     text not null,
  dica       text,
  artigo_id  text references artigos(id),
  exercicios text[] not null
);

create table if not exists conquistas (
  id        text primary key,
  nome      text not null,
  descricao text,
  imagem    text
);

-- ---------- DADOS DO USUÁRIO (privados, por auth.uid()) ----------

create table if not exists perfis (
  id          uuid primary key references auth.users(id) on delete cascade,
  nome        text,
  inicio      timestamptz default now(),
  lembrete    time default '21:00',
  som         boolean default true,
  vibrar      boolean default true,
  habitos_ativos text[] default '{sono,agua,treino-pelvico,movimento,respiracao,sem-pornografia}',
  criado_em   timestamptz default now()
);

create table if not exists dias_concluidos (
  usuario_id uuid not null references auth.users(id) on delete cascade,
  dia        smallint not null references programa_dias(dia),
  feito_em   timestamptz not null default now(),
  primary key (usuario_id, dia)
);

create table if not exists treinos (
  id           bigint generated always as identity primary key,
  usuario_id   uuid not null references auth.users(id) on delete cascade,
  exercicio_id text not null references exercicios(id),
  data         date not null default current_date,
  criado_em    timestamptz not null default now()
);
create index if not exists treinos_usuario_data on treinos (usuario_id, data);

create table if not exists habitos_registro (
  usuario_id uuid not null references auth.users(id) on delete cascade,
  habito_id  text not null references habitos(id),
  data       date not null default current_date,
  primary key (usuario_id, habito_id, data)
);

create table if not exists diario (
  id         uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  data       timestamptz not null default now(),
  tipo       text not null check (tipo in ('solo','parceria')),
  minutos    smallint not null check (minutos between 0 and 120),
  controle   smallint not null check (controle between 1 and 5),
  tecnicas   text[] not null default '{}',
  notas      text
);
create index if not exists diario_usuario_data on diario (usuario_id, data desc);

create table if not exists avaliacoes (
  id         bigint generated always as identity primary key,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  data       timestamptz not null default now(),
  pontos     smallint not null check (pontos between 0 and 20),
  tempo      smallint not null check (tempo between 0 and 4),
  respostas  smallint[] not null
);

-- ---------- SEGURANÇA (Row Level Security) ----------

do $$
declare t text;
begin
  -- conteúdo: qualquer um lê, ninguém escreve pelo app
  foreach t in array array['exercicios','nutrientes','alimentos','alimentos_evitar','receitas','cardapio','habitos','artigos','programa_fases','programa_dias','conquistas'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists leitura_publica on %I', t);
    execute format('create policy leitura_publica on %I for select using (true)', t);
  end loop;

  -- dados pessoais: cada usuário só vê e altera o que é seu
  foreach t in array array['dias_concluidos','treinos','habitos_registro','diario','avaliacoes'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists dono on %I', t);
    execute format('create policy dono on %I for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id)', t);
  end loop;
end $$;

alter table perfis enable row level security;
drop policy if exists dono on perfis;
create policy dono on perfis for all using (auth.uid() = id) with check (auth.uid() = id);

-- cria o perfil automaticamente quando alguém se cadastra
create or replace function criar_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into perfis (id) values (new.id) on conflict do nothing;
  return new;
end $$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario after insert on auth.users
  for each row execute function criar_perfil();
