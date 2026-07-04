# Tasks

A simple personal task manager. Add a task with a title and due date, see
what's outstanding sorted soonest-first, check things off, delete what you
don't need. Data persists in Supabase, so it's there next time you open the
browser.

Built for one person, one browser — no accounts, no sign-in.

## Stack

React 18 + Vite, Supabase (Postgres) for storage, deployed on Vercel.

## Local setup

```bash
npm install
cp .env.example .env
# then fill in .env with your own Supabase project's URL + anon/publishable key
npm run dev
```

## Setting up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run everything in `supabase/schema.sql`.
3. Go to Project Settings → API Keys and copy the **Project URL** and
   **publishable key** (or legacy anon key) into your `.env` file (see
   `.env.example`).

## Deploying

This is a static Vite app, so any static host works. The intended path is
Vercel:

1. Push this repo to GitHub.
2. Import it in Vercel (vercel.com/new).
3. Add the two environment variables from your `.env` file
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project's
   Settings → Environment Variables.
4. Deploy. Vercel auto-detects the Vite build settings.

## Project structure & conventions

See `CLAUDE.md` for the full breakdown of the schema, file structure, and
coding conventions this project follows — read that before making changes.
