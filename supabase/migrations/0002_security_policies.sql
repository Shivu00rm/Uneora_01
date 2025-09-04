-- Encryption key should be set at runtime: select set_config('app.enc_key', '<32+ char key>', false);
-- Example encrypt/decrypt helpers using pgcrypto; key read from GUC app.enc_key
create or replace function public.encrypt_text(plaintext text)
returns bytea language plpgsql as $$
begin
  return pgp_sym_encrypt(plaintext, current_setting('app.enc_key', true));
end;$$;

create or replace function public.decrypt_text(cipher bytea)
returns text language plpgsql as $$
begin
  return pgp_sym_decrypt(cipher, current_setting('app.enc_key', true));
end;$$;

-- Example: api_integrations table with encrypted credentials
create table if not exists public.api_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  service_name text not null,
  service_type text not null,
  credentials_encrypted bytea not null,
  config jsonb not null default '{}',
  status text not null default 'disconnected',
  last_sync timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.api_integrations enable row level security;

-- Read/write only within user's organization; SUPER_ADMIN may read all
create policy "api_integrations read" on public.api_integrations for select using (
  exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and (up.role = 'SUPER_ADMIN' or up.organization_id = api_integrations.organization_id)
  )
);

create policy "api_integrations write" on public.api_integrations for insert with check (
  exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and up.organization_id = api_integrations.organization_id and up.role in ('ORG_ADMIN','SUPER_ADMIN')
  )
);

create policy "api_integrations update" on public.api_integrations for update using (
  exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and (up.role = 'SUPER_ADMIN' or up.organization_id = api_integrations.organization_id)
  )
) with check (
  exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and (up.role = 'SUPER_ADMIN' or up.organization_id = api_integrations.organization_id)
  )
);
