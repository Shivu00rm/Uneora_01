-- Enable required extensions
create extension if not exists pgcrypto;

-- events_outbox table for event-driven architecture
create table if not exists public.events_outbox (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  payload jsonb not null,
  status text not null default 'pending',
  retries int not null default 0,
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);

alter table public.events_outbox enable row level security;
-- Service role bypasses RLS; disallow anon/auth by default
create policy "deny all events_outbox" on public.events_outbox for all using (false);

-- audit_logs table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid,
  action text not null,
  module text not null,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
-- Only users of same org can read their org's audit logs; SUPER_ADMIN can read all via elevated role
create policy "audit read same org" on public.audit_logs
  for select using (
    exists (
      select 1 from public.user_profiles up
      where up.id = auth.uid() and (up.role = 'SUPER_ADMIN' or up.organization_id = audit_logs.organization_id)
    )
  );

-- Helper: current user's organization id
create or replace function public.current_user_org_id() returns uuid language sql stable as $$
  select organization_id from public.user_profiles where id = auth.uid();
$$;
