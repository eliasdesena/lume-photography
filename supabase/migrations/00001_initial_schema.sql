-- ============================================================
-- LUME Course Platform — Initial Schema
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
-- Auto-populated via trigger on auth.users insert
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text not null,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── Entitlements ────────────────────────────────────────────
-- Tracks which products a user has purchased access to
create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text not null default 'prod_U9zCzd0tuKoOuU',
  stripe_payment_intent_id text,
  granted_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.entitlements enable row level security;

create policy "Users can read own entitlements"
  on public.entitlements for select
  using (auth.uid() = user_id);

-- Service role inserts (via webhook), no client insert/update/delete

-- ── Leads ───────────────────────────────────────────────────
-- Captured during checkout before payment completes (abandoned cart data)
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  stripe_payment_intent_id text,
  converted boolean default false,
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Service role only — no client access to leads table

-- ── Course Progress ─────────────────────────────────────────
-- Per-lesson completion and watch progress tracking
create table public.course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id text not null,
  completed boolean default false,
  progress_seconds integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table public.course_progress enable row level security;

create policy "Users can read own progress"
  on public.course_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.course_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.course_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Auto-profile trigger ────────────────────────────────────
-- Creates a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Storage bucket for downloads ────────────────────────────
insert into storage.buckets (id, name, public)
values ('downloads', 'downloads', false);

-- Only entitled users can read from the downloads bucket
create policy "Entitled users can download"
  on storage.objects for select
  using (
    bucket_id = 'downloads'
    and auth.uid() in (
      select user_id from public.entitlements
      where product_id = 'prod_U9zCzd0tuKoOuU'
    )
  );
