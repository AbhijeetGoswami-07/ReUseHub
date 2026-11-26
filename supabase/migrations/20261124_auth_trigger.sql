-- ReUseHub User Profiles Auto-Creation and Security Policies

-- 1. Ensure city & state columns exist on profiles
alter table public.profiles 
add column if not exists city text,
add column if not exists state text;

-- 2. Trigger function to automatically create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, city, state, role, created_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    coalesce(new.raw_user_meta_data->>'city', null),
    coalesce(new.raw_user_meta_data->>'state', null),
    'user', -- Always default to 'user' for security. Users cannot assign admin role.
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger hook on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Secure RLS policies on profiles table
drop policy if exists "Users can update own profile" on public.profiles;

-- Allow users to update their own profile details, but restrict role alteration
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id and
    -- Ensure user cannot elevate their own role to admin
    (role = (select p.role from public.profiles p where p.id = auth.uid()))
  );

-- Admin policy: Admins can view and manage all profiles
create policy "Admins can view and update all profiles"
  on public.profiles
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 4. Supabase Storage: Avatars bucket setup
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
