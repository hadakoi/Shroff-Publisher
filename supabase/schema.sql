-- Shroff Publishers starter schema for Supabase
-- Run this in the Supabase SQL editor after creating a project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  address text,
  pincode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.books (
  id text primary key,
  title text not null,
  authors text not null,
  price numeric(10, 2) not null,
  cover_url text not null,
  thumbnail_url text,
  category text not null,
  category_label text not null,
  publisher text not null,
  description text not null,
  stock integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, book_id)
);

alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

create policy "Public books are readable"
  on public.books
  for select
  using (true);

create policy "Users can read their profile"
  on public.profiles
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their profile"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their profile"
  on public.profiles
  for update
  using (auth.uid() = user_id);

create policy "Users can read their cart"
  on public.carts
  for select
  using (auth.uid() = user_id);

create policy "Users can create their cart"
  on public.carts
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their cart"
  on public.carts
  for update
  using (auth.uid() = user_id);

create policy "Users can read items in their cart"
  on public.cart_items
  for select
  using (
    exists (
      select 1
      from public.carts
      where carts.id = cart_items.cart_id
        and carts.user_id = auth.uid()
    )
  );

create policy "Users can insert items in their cart"
  on public.cart_items
  for insert
  with check (
    exists (
      select 1
      from public.carts
      where carts.id = cart_items.cart_id
        and carts.user_id = auth.uid()
    )
  );

create policy "Users can update items in their cart"
  on public.cart_items
  for update
  using (
    exists (
      select 1
      from public.carts
      where carts.id = cart_items.cart_id
        and carts.user_id = auth.uid()
    )
  );

create policy "Users can delete items in their cart"
  on public.cart_items
  for delete
  using (
    exists (
      select 1
      from public.carts
      where carts.id = cart_items.cart_id
        and carts.user_id = auth.uid()
    )
  );
