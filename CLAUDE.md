# CLAUDE.md

Context for any AI assistant (or human) working in this repo.

## Project purpose

A personal task manager for a single freelance consultant. One person, one
browser, no accounts. Add a task with a title and due date, see incomplete
tasks sorted soonest-first, mark tasks complete, delete tasks, and have all
of it persist across browser sessions.

This is intentionally small in scope. Do not add multi-user support,
authentication, or a mobile app unless explicitly asked.

## Tech stack

- **React 18 + Vite** — frontend, functional components only
- **Supabase** — Postgres database used purely for data persistence (no
  auth, no RLS — see below)
- **Vercel** — static hosting / deployment, deploys from the `main` branch

No state management library, no CSS framework, no component library. Plain
CSS in `src/App.css` and `src/index.css`, using CSS custom properties as the
design token system.

## Supabase table schema — DO NOT CHANGE without discussion

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_date date not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
```

The full migration lives in `supabase/schema.sql`. If a new column or table
is genuinely needed, add a new migration file rather than editing the
schema.sql in place, and update this document to match.

RLS is intentionally disabled — this is a single-user app authenticated
only by possession of the Supabase anon key. If this project is ever shared
with more than one person, add Supabase Auth and RLS policies before doing
so; do not skip that step to save time.

## File structure

```
src/
  supabaseClient.js       Supabase client init, reads VITE_SUPABASE_* env vars
  App.jsx                 Top-level state: fetch/add/toggle/delete tasks
  App.css                 All component styling
  index.css               Global reset + design tokens (CSS variables)
  components/
    AddTaskForm.jsx        Title + due date inputs, calls onAdd(title, dueDate)
    TaskList.jsx            Groups tasks by due-date bucket, renders TaskItem
    TaskItem.jsx            Single row: checkbox, title, date, delete button
    Toast.jsx               Generic bottom toast used for the delete/undo flow
supabase/
  schema.sql               The one and only source of truth for the DB schema
```

## Coding conventions

- Functional components only, no class components.
- No default exports for anything except React components.
- Keep components focused: if a component starts doing two unrelated
  things, split it rather than adding a second responsibility.
- Data mutations (add/toggle/delete) live in `App.jsx` and are passed down
  as props (`onAdd`, `onToggle`, `onDelete`). Child components stay
  presentational and don't talk to Supabase directly.
- Optimistic UI updates are used for add/toggle/delete, with rollback on
  Supabase error. Any new mutation should follow the same pattern: update
  local state first, then reconcile with the server response or roll back.
- Environment variables are read via `import.meta.env.VITE_*` — never hard
  code Supabase URLs or keys in source.

## What NOT to do

- Don't reintroduce user accounts/auth — out of scope for this tool.
- Don't change the `tasks` table schema without updating both
  `supabase/schema.sql` and this file in the same change.
- Don't add a UI framework (MUI, Chakra, Tailwind, etc.) — the existing
  plain-CSS design system is intentional and sufficient for this app's size.
- Don't remove the optimistic-update + rollback pattern in favor of
  "wait for the server" — the app should feel instant.

## Design system reference

Color tokens, spacing, and typography are all defined as CSS variables at
the top of `src/index.css` (`--paper`, `--ink`, `--accent`, `--success`,
`--danger`, etc.). Reuse these tokens rather than introducing new raw hex
values in components.
