-- Seed an admin into public.profiles
-- Run this in the Supabase Dashboard → SQL Editor (or via a DB connection).
-- Prerequisites:
--   1. The `profiles` table must already exist (created in STEP 3 schema).
--   2. The auth user with this id must exist in `auth.users`
--      (i.e. the admin was created via Supabase Auth). If `profiles.id`
--      has a FK to auth.users, the insert will fail otherwise.

insert into public.profiles (id, role)
values (
  '900774f6-db24-4097-8e11-28c75481848a',
  'admin'
)
on conflict (id)
do update set role = 'admin';

-- Verify:
select id, role
from public.profiles
where id = '900774f6-db24-4097-8e11-28c75481848a';
-- Expected:
-- id                                    | role
-- 900774f6-db24-4097-8e11-28c75481848a | admin
