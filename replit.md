# SB Somali Business

Trusted Somali freelance & job marketplace — connects employers and workers
with subscriptions, job applications, public profiles, and a full anti-scam system.

## Run & Operate

- Workflow: **Start application** → `npm run dev` → port **5000**, host `0.0.0.0`
- TypeScript: `npx tsc --noEmit`
- Required env vars (in `.env`):
  ```
  VITE_SUPABASE_URL=https://xxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=...
  ```
- DB migrations: `supabase/001_initial.sql` → `supabase/002_plans_applications.sql`

## Stack

- **Vite + React + TypeScript** (SPA)
- **Tailwind CSS** + design tokens (`src/index.css`)
- **wouter** routing
- **@tanstack/react-query** data/state
- **react-hook-form + zod** forms
- **Radix UI** (Dialog, Select, DropdownMenu, Toast)
- **lucide-react** icons · **framer-motion** animations · **date-fns**
- **Supabase** (auth + Postgres RLS) — `src/lib/supabase.ts`

## Where Things Live

```
src/
  App.tsx              — routes
  pages/               — one file per route
  components/          — shared UI + auth/ subfolder
  components/ui/       — design system primitives
  hooks/               — useAuth, useJobs, useFreelancers, usePlan, useApplications
  lib/                 — supabase.ts, plans.ts, profileCompletion.ts, utils.ts
  utils/               — trustScore.ts, helpers.ts, spamFilter.ts
supabase/
  001_initial.sql      — schema v1 (profiles, jobs, freelancers, RLS, triggers)
  002_plans_applications.sql — schema v2 (plan fields, applications, reviews)
```

Source-of-truth files: `src/lib/supabase.ts` (types), `src/lib/plans.ts` (plan definitions).

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/jobs` | Jobs list |
| `/jobs/:id` | Job details + Apply CTA |
| `/jobs/:id/apply` | Apply to job form |
| `/freelancers` | Freelancers list |
| `/profile/:id` | Public user profile |
| `/post-job` | Post a job (plan-gated) |
| `/create-profile` | Create freelancer profile |
| `/pricing` | Plan comparison grid |
| `/upgrade/:planId` | Upgrade/checkout flow |
| `/dashboard` | User dashboard |

## Architecture Decisions

- **Graceful Supabase fallback**: app boots without env vars; `console.warn` only.
  All hooks return empty arrays / nulls instead of crashing.
- **Plan logic in `src/lib/plans.ts`**: single source of truth — limits, features,
  comparison table rows. DB stores `profiles.plan TEXT DEFAULT 'free'`.
- **Applications table** (`supabase/002`): unique constraint `(job_id, user_id)` prevents
  duplicate applications server-side + surfaced as friendly error message.
- **Trust score** auto-calculated by DB triggers on job-post, report, and review events.
- **FreelancerCard** links to `/profile/:user_id` only when `user_id` is set (seed data
  has null user_ids → falls back to WhatsApp-only contact).

## Product

- **Job flow**: Browse → Details → Apply (form with cover letter + contact) → Dashboard tracking
- **Freelancer flow**: Create profile → Public profile page at `/profile/:id`
- **Subscription**: Free / Basic ($5) / Free Pro ($9.99 dual-side) / Premium ($10)
  — plan stored on `profiles.plan`, enforced client-side via `usePlan` / `useCanApply`
- **Anti-scam**: trust score, scam banner on every job, report system, honeypot, 24h delay
- **Dashboard**: profile completion bar, stats, my jobs, my applications, plan card

## User Preferences

- UI language: Soomaali (natural, standardized — see glossary in previous session)
- Design: SaaS modern, primary purple `262 60% 50%`, Outfit (display) + Inter (body)
- Keep existing features — extend, do not rewrite
- Supabase must always fail gracefully when env vars are missing

## Gotchas

- Run **both** SQL files in Supabase SQL editor before going live (in order: 001 → 002)
- `jobs_public` is a VIEW — read from it, write to `jobs` table directly
- FreelancerCard profile links require `user_id` column — seed data uses `NULL`
- `useCanApply` / `useCanPost` track monthly limits by calendar month, not rolling 30 days
- DropdownMenu from Radix wraps in a Portal — don't nest inside another Radix Dialog

## Pointers

- Plans: `src/lib/plans.ts`
- Profile completion: `src/lib/profileCompletion.ts`
- Trust system: `src/utils/trustScore.ts`
- Spam protection: `src/utils/spamFilter.ts`
