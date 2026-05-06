# SB Somali Business

Trusted Somali freelance & job marketplace — connects employers and workers
with subscriptions, job applications, public profiles, CV generation, and a full anti-scam system.

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
| `/jobs/:id/applicants` | Applicants management (job-poster-only) |
| `/freelancers` | Freelancers list |
| `/profile/:id` | Public user profile |
| `/cv/:id` | Auto-generated public CV |
| `/post-job` | Post a job (plan-gated) |
| `/create-profile` | Create freelancer profile |
| `/settings` | Profile edit (name, phone, city, bio, website) |
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
- **Applicants page** `/jobs/:id/applicants`: ownership-gated (job.user_id === auth.uid);
  uses `useUpdateApplicationStatus` to accept/reject/mark-seen per applicant.
- **CV page** `/cv/:id`: public, printable, auto-generated from `profiles` + `freelancers` tables;
  shows skills, trust score, plan badge, portfolio links, hire CTA.
- **Route order matters in wouter Switch**: `/jobs/:id/applicants` and `/jobs/:id/apply` must
  appear BEFORE `/jobs/:id`, else the dynamic param swallows the sub-routes.

## Product

- **Job flow**: Browse → Details → Apply (form with cover letter + contact) → Dashboard tracking
- **Applicant management**: Job poster visits `/jobs/:id/applicants` to accept/reject/contact
- **Freelancer flow**: Create profile → Public profile at `/profile/:id` → CV at `/cv/:id`
- **Subscription**: Free / Basic ($5) / Free Pro ($9.99 dual-side) / Premium ($10)
  — plan stored on `profiles.plan`, enforced client-side via `usePlan` / `useCanApply`
- **Anti-scam**: trust score, scam banner on every job, report system, honeypot, 24h delay
- **Dashboard**: stats, my jobs (delete + view applicants), my applications (withdraw), quick actions, profile completion bar, plan card
- **Settings**: profile edit page (full_name, phone, city, bio, website_url) — updates `profiles` table

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
- CV page uses `window.location.href` for clipboard copy — works client-side only

## Pointers

- Plans: `src/lib/plans.ts`
- Profile completion: `src/lib/profileCompletion.ts`
- Trust system: `src/utils/trustScore.ts`
- Spam protection: `src/utils/spamFilter.ts`
- Application hooks: `src/hooks/useApplications.ts` (includes `useUpdateApplicationStatus`)
- Job hooks: `src/hooks/useJobs.ts` (includes `useDeleteJob`, `useUpdateJobStatus`)
