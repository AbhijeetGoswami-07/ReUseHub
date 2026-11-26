-- ReUseHub Admin Dashboard Schema, Policies, and Audit Logs Migration
-- Security Enforcement: Strict Server-Side Administrative Privileges and Immutable Audit Logs

-- 1. Helper function to verify admin status server-side
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 2. Product Categories Table
create table if not exists public.product_categories (
  id text primary key,
  name text not null,
  description text not null,
  waste_factor numeric default 1.0 not null, -- kg weight multiplier for default environmental estimates
  is_active boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Seed initial standard categories
insert into public.product_categories (id, name, description, waste_factor, is_active, sort_order)
values
  ('clothing', 'Clothing & Textiles', 'Apparel, cotton garments, synthetic fabrics, footwear, and textile offcuts.', 0.8, true, 1),
  ('plastic', 'Plastic Containers & Polymers', 'Rigid bottles, storage tubs, polymer containers, and packaging elements.', 0.3, true, 2),
  ('electronics', 'Consumer Electronics & Hardware', 'Computers, circuit boards, peripherals, mechanical keyboards, and appliances.', 1.5, true, 3),
  ('furniture', 'Furniture & Timber Fixtures', 'Chairs, desks, solid wood tables, pallets, and cabinet fixtures.', 8.5, true, 4),
  ('glass', 'Glass Jars & Bottles', 'Food jars, glass canisters, beverage bottles, and architectural glass panes.', 0.6, true, 5),
  ('paper', 'Paper & Cardboard Packaging', 'Corrugated boxes, packing craft sheets, books, and kraft cartons.', 0.4, true, 6),
  ('metal', 'Metal & Hardware Hardware', 'Aluminum cans, steel frames, bicycle frames, brass fittings, and hand tools.', 2.2, true, 7),
  ('household', 'Household & Studio Items', 'Cookware, ceramic planters, tools, lamps, and daily utility sundries.', 1.2, true, 8),
  ('other', 'Other Miscellaneous Materials', 'Mixed-composition and composite reclaimed goods.', 1.0, true, 9)
on conflict (id) do nothing;

-- 3. Unified Content Reports Table
create table if not exists public.content_reports (
  id uuid default gen_random_uuid() primary key,
  content_type text not null check (content_type in ('community_post', 'marketplace_listing')),
  content_id text not null,
  content_title text not null,
  reporter_id uuid references public.profiles(id) on delete set null,
  reporter_email text,
  reason text not null,
  details text not null,
  status text default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes text,
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Admin Audit Logs Table (Immutable Audit Trail)
create table if not exists public.admin_audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references public.profiles(id) on delete set null,
  admin_email text not null,
  action_type text not null,
  target_type text not null,
  target_id text not null,
  target_name text,
  details jsonb default '{}'::jsonb not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Indexes for swift filtering and audit lookup
create index if not exists idx_admin_audit_logs_created_at on public.admin_audit_logs (created_at desc);
create index if not exists idx_admin_audit_logs_action on public.admin_audit_logs (action_type);
create index if not exists idx_content_reports_status on public.content_reports (status);

-- 5. Row Level Security Policies
alter table public.product_categories enable row level security;
alter table public.content_reports enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Categories: Read public, write admin only
drop policy if exists "Categories are viewable by everyone" on public.product_categories;
create policy "Categories are viewable by everyone"
  on public.product_categories for select
  using (true);

drop policy if exists "Only admins can modify categories" on public.product_categories;
create policy "Only admins can modify categories"
  on public.product_categories for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Reports: Authenticated users can create reports, admins can view and update
drop policy if exists "Users can submit reports" on public.content_reports;
create policy "Users can submit reports"
  on public.content_reports for insert
  with check (auth.uid() is not null);

drop policy if exists "Only admins can view and resolve reports" on public.content_reports;
create policy "Only admins can view and resolve reports"
  on public.content_reports for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Audit Logs: Only admins can view, and logs cannot be deleted or updated (Append-only)
drop policy if exists "Admins can view audit logs" on public.admin_audit_logs;
create policy "Admins can view audit logs"
  on public.admin_audit_logs for select
  using (public.is_admin(auth.uid()));

drop policy if exists "Admins can append audit logs" on public.admin_audit_logs;
create policy "Admins can append audit logs"
  on public.admin_audit_logs for insert
  with check (public.is_admin(auth.uid()));
