insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update
set public = excluded.public,
    updated_at = now();

drop policy if exists "avatars are publicly readable" on storage.objects;
drop policy if exists "avatars are insertable by owner" on storage.objects;
drop policy if exists "avatars are updatable by owner" on storage.objects;
drop policy if exists "avatars are deletable by owner" on storage.objects;

create policy "avatars are publicly readable"
on storage.objects
for select
using (bucket_id = 'avatars');

create policy "avatars are insertable by owner"
on storage.objects
for insert
with check (
  bucket_id = 'avatars'
  and auth.uid() is not null
  and auth.uid()::text = split_part(name, '/', 1)
);

create policy "avatars are updatable by owner"
on storage.objects
for update
using (
  bucket_id = 'avatars'
  and auth.uid() is not null
  and auth.uid()::text = split_part(name, '/', 1)
)
with check (
  bucket_id = 'avatars'
  and auth.uid() is not null
  and auth.uid()::text = split_part(name, '/', 1)
);

create policy "avatars are deletable by owner"
on storage.objects
for delete
using (
  bucket_id = 'avatars'
  and auth.uid() is not null
  and auth.uid()::text = split_part(name, '/', 1)
);