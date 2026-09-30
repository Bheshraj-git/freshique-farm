-- Freshique Farm: Storage Buckets & Policies Setup
-- Run this script in the Supabase Dashboard -> SQL Editor

-- 1. Create storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('community-images', 'community-images', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set 
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Storage Policies for product-images
drop policy if exists "Public Access Product Images" on storage.objects;
create policy "Public Access Product Images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Authenticated farmers upload product images" on storage.objects;
create policy "Authenticated farmers upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated farmers update product images" on storage.objects;
create policy "Authenticated farmers update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images');

drop policy if exists "Authenticated farmers delete product images" on storage.objects;
create policy "Authenticated farmers delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');

-- 3. Storage Policies for avatars
drop policy if exists "Public Access Avatars" on storage.objects;
create policy "Public Access Avatars"
on storage.objects for select
using (bucket_id = 'avatars');

drop policy if exists "Authenticated users upload avatars" on storage.objects;
create policy "Authenticated users upload avatars"
on storage.objects for insert
to authenticated
with check (bucket_id = 'avatars');

drop policy if exists "Authenticated users update avatars" on storage.objects;
create policy "Authenticated users update avatars"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars');

-- 4. Storage Policies for community-images
drop policy if exists "Public Access Community Images" on storage.objects;
create policy "Public Access Community Images"
on storage.objects for select
using (bucket_id = 'community-images');

drop policy if exists "Authenticated users upload community images" on storage.objects;
create policy "Authenticated users upload community images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'community-images');

drop policy if exists "Authenticated users delete community images" on storage.objects;
create policy "Authenticated users delete community images"
on storage.objects for delete
to authenticated
using (bucket_id = 'community-images');
