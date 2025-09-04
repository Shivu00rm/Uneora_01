-- Base types
create type user_role as enum ('SUPER_ADMIN','ORG_ADMIN','ORG_USER');

-- organizations table
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  status text not null default 'active',
  subscription_plan text not null default 'starter',
  billing_email text,
  custom_domain text,
  features text[],
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizations enable row level security;

-- user_profiles table (links to Supabase auth.users via id)
create table if not exists public.user_profiles (
  id uuid primary key,
  organization_id uuid references public.organizations(id) on delete set null,
  role user_role not null default 'ORG_USER',
  name text not null,
  email text not null unique,
  avatar_url text,
  status text not null default 'active',
  permissions jsonb not null default '{}',
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

-- Policies
-- Users can read their own profile; SUPER_ADMIN can read all
create policy if not exists "user_profiles read self or super" on public.user_profiles
for select using (
  id = auth.uid() or exists(
    select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'SUPER_ADMIN'
  )
);

-- Users can update their own profile (basic)
create policy if not exists "user_profiles update self" on public.user_profiles
for update using (id = auth.uid()) with check (id = auth.uid());

-- Organization access policy example
create policy if not exists "organizations read same org or super" on public.organizations
for select using (
  exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and (up.role = 'SUPER_ADMIN' or up.organization_id = organizations.id)
  )
);
