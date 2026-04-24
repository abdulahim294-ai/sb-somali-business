# SB Somali Business

Marketplace bilaash ah oo isku xira ganacsatada iyo xirfadlayaasha Soomaaliyeed
("jobs / freelancers"). Khidmadaha guud:

- Daabicid shaqo (Post Job)
- Samaynta profile xirfadle (Create Profile)
- Raadinta shaqooyinka & xirfadlayaasha
- Difaac khayaano (Anti-scam) — banner caawiye, trust score, soo sheegis,
  honeypot, 24h delay, 3/day rate-limit
- Auth (email + Google) iyada oo loo isticmaalo Supabase

UI-ga waxaa lagu qoray Soomaali, muuqaalkuna waa SaaS modern.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** + design tokens custom ah (`src/index.css`)
- **wouter** (routing)
- **@tanstack/react-query** (state)
- **react-hook-form + zod** (forms)
- **Radix UI** (Dialog, Select, Toast)
- **lucide-react** (icons), **framer-motion**, **date-fns**
- **Supabase** (auth + Postgres) — `src/lib/supabase.ts`

## Run / Dev

- Workflow: `Start application` → `npm run dev` → port **5000**, host `0.0.0.0`,
  `allowedHosts: true` (preview iframe wuu shaqaynayaa)
- Vite manual chunks waa la sameeyay si bundle-ku u yaraado.

## Environment

`src/lib/supabase.ts` waa dulqaad leh — haddii env-yada la waayo wuu
console.warn gareeyaa oo ka boodaa baddalka burburka. Si feature-yadu si buuxda
ay u shaqeeyaan, geli `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

`SETUP.md` iyo `supabase/001_initial.sql` waxay leeyihiin tilmaamo si database
loo sameeyo.

## Routes (`src/App.tsx`)

| Path              | Component       |
| ----------------- | --------------- |
| `/`               | `Home`          |
| `/jobs`           | `Jobs`          |
| `/jobs/:id`       | `JobDetails`    |
| `/freelancers`    | `Freelancers`   |
| `/post-job`       | `PostJob`       |
| `/create-profile` | `CreateProfile` |
| `*`               | `NotFound`      |

## Design system (`src/index.css`)

- **Tokens**: primary purple `262 60% 50%`, radius `0.85rem`, font display
  (Plus Jakarta) iyo body (Inter).
- **Containers**:
  - `container-app` — `max-w-6xl` ku haboon bogagga guud
  - `container-narrow` — `max-w-3xl` ku haboon hero/CTA
  - `container-form` — `max-w-2xl` ku haboon foomamka
- **Utility classes**: `text-gradient`, `card-hover`, `section-eyebrow`,
  `scam-banner`, `skeleton`, `trust-*`, `no-scrollbar`, `hp-field` (honeypot).
- **UI primitives** (`src/components/ui/`): Button, Input, Textarea, Label,
  FormField, Select, Dialog, Badge (success/warning), Toast.

## Components muhiim ah

- `Header` — active route highlight, mobile menu buuxa oo body-scroll-lock leh
- `Footer` — 4 column, "La sameeyay ❤ Soomaaliya"
- `JobCard`, `FreelancerCard` — primary CTA "Eeg"
- `AuthModal` — email + Google, show/hide password, scam-banner
- `ReportDialog` — la wadaago labada page (Jobs list & JobDetails)

## Hooks (`src/hooks/`)

- `useAuth` — context provider, profile load
- `useJobs` — `useJobs / useJob / useMyJobs / useBookmarks /
  useCreateJob / useDeleteJob / useReportJob / useToggleBookmark`
- `useFreelancers` — `useFreelancers / useCreateFreelancer`
- `useToast`

## Anti-scam (`src/utils/`)

- `spamFilter.ts` — keyword blocklist, honeypot, 24h delay, 3/day rate-limit
- `trustScore.ts` — `getTrustInfo`, `SCAM_TIPS`, `REPORT_REASONS`
- `helpers.ts` — `LOCATIONS`, `JOB_TYPES`, `shareJobWA`, `contactEmployerWA`

## Soomaali — istilaaxda guud

| Sax | Khalad |
| --- | ------ |
| Soo gal | Galin / Logn |
| Hadda | Haddeer |
| La xaqiijiyay | Xaqiijiyey |
| Daabac shaqo | Daabaco shaqo |
| Sug in yar | Sug Yar |
| Ku dar | Kudar |
| Dhammaan meelaha | Dhammaan Meelaaha |
| Shaqo lama helin | Shaqo la ma helin |
| Ku shaqaysiiso xirfadle | Ku Shaqeysi Xirfadlaha |
| Sharax | Sharrax |

## Deploy

- `vercel.json` waxa uu leeyahay SPA rewrites.
- Replit Deployments — `npm run build` keenaya `dist/`, kadibna `vite preview`
  ama static host.
