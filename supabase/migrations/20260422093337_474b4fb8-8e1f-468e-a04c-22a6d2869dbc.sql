
-- Trigger function to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- CLIENTS
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  service_type text,
  source text,
  status text not null default 'active',
  assigned_to text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Authenticated can view clients"
  on public.clients for select
  to authenticated using (true);

create policy "Authenticated can insert clients"
  on public.clients for insert
  to authenticated with check (true);

create policy "Authenticated can update clients"
  on public.clients for update
  to authenticated using (true);

create policy "Authenticated can delete clients"
  on public.clients for delete
  to authenticated using (true);

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- PROJECTS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  address text,
  service_type text,
  stage text not null default 'inquiry',
  estimated_value numeric,
  due_date date,
  progress integer not null default 0,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Authenticated can view projects"
  on public.projects for select
  to authenticated using (true);

create policy "Authenticated can insert projects"
  on public.projects for insert
  to authenticated with check (true);

create policy "Authenticated can update projects"
  on public.projects for update
  to authenticated using (true);

create policy "Authenticated can delete projects"
  on public.projects for delete
  to authenticated using (true);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create index projects_client_id_idx on public.projects(client_id);
create index projects_stage_idx on public.projects(stage);
