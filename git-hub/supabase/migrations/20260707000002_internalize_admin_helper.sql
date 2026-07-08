create schema if not exists app_private;

grant usage on schema app_private to authenticated;

create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function app_private.is_admin() to authenticated;

drop policy if exists "roles are readable by owner or admin" on public.user_roles;
drop policy if exists "roles are manageable by admin" on public.user_roles;
drop policy if exists "roles are updatable by admin" on public.user_roles;
drop policy if exists "roles are deletable by admin" on public.user_roles;

drop policy if exists "genres are manageable by admin" on public.genres;
drop policy if exists "genres are updatable by admin" on public.genres;
drop policy if exists "genres are deletable by admin" on public.genres;

drop policy if exists "books are manageable by admin" on public.books;
drop policy if exists "books are updatable by admin" on public.books;
drop policy if exists "books are deletable by admin" on public.books;

create policy "roles are readable by owner or admin"
on public.user_roles
for select
using (auth.uid() = user_id or app_private.is_admin());

create policy "roles are manageable by admin"
on public.user_roles
for insert
with check (app_private.is_admin());

create policy "roles are updatable by admin"
on public.user_roles
for update
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "roles are deletable by admin"
on public.user_roles
for delete
using (app_private.is_admin());

create policy "genres are manageable by admin"
on public.genres
for insert
with check (app_private.is_admin());

create policy "genres are updatable by admin"
on public.genres
for update
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "genres are deletable by admin"
on public.genres
for delete
using (app_private.is_admin());

create policy "books are manageable by admin"
on public.books
for insert
with check (app_private.is_admin());

create policy "books are updatable by admin"
on public.books
for update
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "books are deletable by admin"
on public.books
for delete
using (app_private.is_admin());

drop function if exists public.is_admin();