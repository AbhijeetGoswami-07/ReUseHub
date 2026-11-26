-- ReUseHub Initial Database Schema
-- Environmental Studies Product Reuse Recommendation System

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'community_lead', 'admin')),
  total_items_diverted integer default 0,
  co2_saved_kg numeric default 0,
  waste_diverted_kg numeric default 0,
  community_points integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Products Table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  category text not null,
  condition text not null check (condition in ('like_new', 'good', 'minor_fault', 'broken', 'scrap')),
  description text not null,
  material text,
  image_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Recommendations Table
create table if not exists public.recommendations (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade,
  action text not null check (action in ('reuse', 'repair', 'upcycle', 'donate', 'recycle')),
  title text not null,
  difficulty text check (difficulty in ('easy', 'moderate', 'advanced')),
  estimated_time_minutes integer default 30,
  co2_kg_saved numeric default 0,
  waste_kg_diverted numeric default 0,
  summary text not null,
  steps jsonb default '[]'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Marketplace Listings Table
create table if not exists public.marketplace_listings (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text not null,
  condition text not null,
  action_recommendation text not null check (action_recommendation in ('reuse', 'repair', 'upcycle', 'donate', 'recycle')),
  price numeric default 0 not null,
  is_free boolean default false not null,
  location text not null,
  image_url text,
  status text default 'active' check (status in ('active', 'reserved', 'completed')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.recommendations enable row level security;
alter table public.marketplace_listings enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Products viewable by everyone" on public.products for select using (true);
create policy "Authenticated users can insert products" on public.products for insert with check (auth.role() = 'authenticated');

create policy "Recommendations viewable by everyone" on public.recommendations for select using (true);

create policy "Marketplace listings viewable by everyone" on public.marketplace_listings for select using (true);
create policy "Users can insert own marketplace listings" on public.marketplace_listings for insert with check (auth.uid() = seller_id);
create policy "Users can update own marketplace listings" on public.marketplace_listings for update using (auth.uid() = seller_id);
