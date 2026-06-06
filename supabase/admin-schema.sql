-- Admin role table
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Admins can see who else is an admin (needed for is_admin() to work under invoker security)
create policy "Admins can view admin list"
  on public.admin_users for select
  to authenticated
  using (auth.uid() = user_id);

-- Helper: is the current user an admin?
-- SECURITY DEFINER so it can read admin_users regardless of caller's RLS context.
-- search_path = '' prevents schema injection.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- Grant books write to admins
create policy "Admins can update books"
  on public.books for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can insert books"
  on public.books for insert
  to authenticated
  with check (public.is_admin());

-- Admins can read ALL profiles (overrides the per-user policy)
create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- Admins can read ALL carts
create policy "Admins can view all carts"
  on public.carts for select
  to authenticated
  using (public.is_admin());

create policy "Admins can view all cart items"
  on public.cart_items for select
  to authenticated
  using (public.is_admin());
