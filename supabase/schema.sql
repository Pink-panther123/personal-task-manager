-- Task Manager — Supabase schema
-- Run this once in the Supabase SQL editor for a new project.
-- This is a single-user personal tool: no auth, no RLS policies restricting
-- access, since only the owner ever has the project's anon key.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_date date not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Keep unfinished tasks fast to sort by due date.
create index if not exists tasks_due_date_idx on public.tasks (due_date);

-- Row Level Security is left OFF intentionally for this single-user app
-- using the public anon key. If this project is ever shared with more than
-- one person, add auth + RLS policies before doing so.
alter table public.tasks disable row level security;
