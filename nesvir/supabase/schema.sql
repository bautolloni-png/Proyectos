-- Nesvir MVP schema: empresas (tenants), usuarios, procesos.
-- Run this once against a fresh Supabase project (SQL Editor or `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- empresas
-- ---------------------------------------------------------------------------
create table if not exists public.empresas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  logo_url text,
  color_primario text not null default '#FFFFFF',
  color_acento text not null default '#5198D5',
  creado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- usuarios (mirrors auth.users, one row per member of an empresa)
-- ---------------------------------------------------------------------------
create table if not exists public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  nombre text not null,
  email text not null,
  rol text not null default 'miembro' check (rol in ('admin', 'miembro')),
  creado_en timestamptz not null default now()
);

create index if not exists usuarios_empresa_id_idx on public.usuarios (empresa_id);

-- ---------------------------------------------------------------------------
-- procesos (pasos/archivos/videos/enlaces kept as JSONB — a process's steps
-- are always read/written together with the process itself, so a normalized
-- child table would only add joins without any real benefit)
-- ---------------------------------------------------------------------------
create table if not exists public.procesos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete cascade,
  nombre text not null,
  descripcion text not null default '',
  objetivo text not null default '',
  responsable text not null default '',
  pasos jsonb not null default '[]'::jsonb,
  archivos jsonb not null default '[]'::jsonb,
  videos jsonb not null default '[]'::jsonb,
  enlaces jsonb not null default '[]'::jsonb,
  observaciones text not null default '',
  creado_por uuid references public.usuarios (id) on delete set null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists procesos_empresa_id_idx on public.procesos (empresa_id);

create or replace function public.set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists procesos_set_actualizado_en on public.procesos;
create trigger procesos_set_actualizado_en
  before update on public.procesos
  for each row
  execute function public.set_actualizado_en();

-- ---------------------------------------------------------------------------
-- RLS: every row is scoped to the caller's own empresa_id.
-- ---------------------------------------------------------------------------
alter table public.empresas enable row level security;
alter table public.usuarios enable row level security;
alter table public.procesos enable row level security;

-- security definer so policies on `usuarios` don't recurse into themselves
-- when looking up the caller's empresa_id.
create or replace function public.get_empresa_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select empresa_id from public.usuarios where id = auth.uid();
$$;

create policy "empresas: ver la propia" on public.empresas
  for select using (id = public.get_empresa_id());

create policy "empresas: actualizar la propia" on public.empresas
  for update using (id = public.get_empresa_id());

create policy "usuarios: ver los de mi empresa" on public.usuarios
  for select using (empresa_id = public.get_empresa_id());

create policy "usuarios: actualizar mi propio registro" on public.usuarios
  for update using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- Signup: creates the empresa + usuario row the instant auth.users gets a new
-- row, instead of from client code — this way it fires whether or not email
-- confirmation is enabled, so it never races the client's own session state.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  nueva_empresa_id uuid;
begin
  insert into public.empresas (nombre)
  values (coalesce(new.raw_user_meta_data ->> 'nombre_empresa', 'Mi empresa'))
  returning id into nueva_empresa_id;

  insert into public.usuarios (id, empresa_id, nombre, email, rol)
  values (
    new.id,
    nueva_empresa_id,
    coalesce(new.raw_user_meta_data ->> 'nombre_usuario', new.email),
    new.email,
    'admin'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create policy "procesos: ver los de mi empresa" on public.procesos
  for select using (empresa_id = public.get_empresa_id());

create policy "procesos: crear en mi empresa" on public.procesos
  for insert to authenticated with check (empresa_id = public.get_empresa_id());

create policy "procesos: actualizar los de mi empresa" on public.procesos
  for update using (empresa_id = public.get_empresa_id());

create policy "procesos: borrar los de mi empresa" on public.procesos
  for delete using (empresa_id = public.get_empresa_id());
