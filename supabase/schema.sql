-- ============================================================================
-- Pépinière Al Akhawayn — Database Schema (STEP 3)
-- Run this in Supabase → SQL Editor, or via a direct DATABASE_URL (psql/pg).
-- Runs with service_role / superuser (bypasses RLS), so DDL + seed succeed.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text,
  role       text default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  price               numeric not null default 0,
  short_description   text,
  description         text,
  main_image          text,
  visible             boolean not null default true,
  light_requirement   text,
  water_requirement   text,
  care_instructions   text,
  suitable_location   text,
  temperature         text,
  humidity            text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products (id) on delete cascade,
  image_url   text not null,
  public_id   text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Indexes
-- ---------------------------------------------------------------------------
create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_visible_idx on public.products (visible);
create index if not exists product_images_product_id_idx
  on public.product_images (product_id);

-- ---------------------------------------------------------------------------
-- 3. updated_at trigger (best-effort)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. is_admin() — SECURITY DEFINER avoids RLS recursion on profiles
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;

-- profiles: user manages own row; admin manages all
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists profiles_delete on public.profiles;
create policy profiles_delete on public.profiles
  for delete using (public.is_admin());

-- products: public reads visible only; admin full access
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select using (visible = true or public.is_admin());

drop policy if exists products_insert on public.products;
create policy products_insert on public.products
  for insert with check (public.is_admin());

drop policy if exists products_update on public.products;
create policy products_update on public.products
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists products_delete on public.products;
create policy products_delete on public.products
  for delete using (public.is_admin());

-- product_images: public reads images of visible products; admin full access
drop policy if exists product_images_select on public.product_images;
create policy product_images_select on public.product_images
  for select using (
    public.is_admin() or exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.visible = true
    )
  );

drop policy if exists product_images_all on public.product_images;
create policy product_images_all on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. Seed admin profile
-- ---------------------------------------------------------------------------
insert into public.profiles (id, role)
values ('900774f6-db24-4097-8e11-28c75481848a', 'admin')
on conflict (id) do update set role = 'admin';

-- ---------------------------------------------------------------------------
-- 7. Verify
-- ---------------------------------------------------------------------------
select id, role
from public.profiles
where id = '900774f6-db24-4097-8e11-28c75481848a';
