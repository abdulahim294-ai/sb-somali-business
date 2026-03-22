# 🇸🇴 SB Somali Business v2.0 — Tilmaamaha Dejinta (Setup Guide)

## Xiriirka Degdeg
- WhatsApp: [+252 68 707 6746](https://wa.me/252687076746)
- Email: Somalibusinesssb@gmail.com

---

## Tallaabada 1 — Supabase Samee (bilaash)

1. Tag [supabase.com](https://supabase.com) → **Start your project** → GitHub-ka ku gal
2. **New Project** → magac: `sb-somali-business` → password adag doorso
3. Sugso 2 daqiiqo ilaa project-ka dhammaado
4. **SQL Editor** → **New Query** → nuqul geli dhammaan waxa ku jira `supabase/001_initial.sql` → **Run**
5. Tag **Project Settings → API** — nuqul ka qaad:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

---

## Tallaabada 2 — .env Samee

```bash
cp .env.example .env
```

Ka buuxi `.env`:
```
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## Tallaabada 3 — Bilaw Locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## Tallaabada 4 — GitHub

```bash
git init
git add .
git commit -m "SB Somali Business v2.0 — Production Ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sb-somali-business.git
git push -u origin main
```

---

## Tallaabada 5 — Vercel (bilaash)

1. Tag [vercel.com](https://vercel.com) → **New Project** → GitHub repo dooro
2. **Environment Variables** ku dar:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy** → link-kaaga hel → dhammaatay! 🎉

---

## Tallaabada 6 — Supabase Auth Settings

Tag Supabase → **Authentication → URL Configuration**:
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Nidaamka Ammaan — Faahfaahin

| Layer | Waxa Qabta |
|-------|-----------|
| Layer 1 | 60+ keyword blocklist (lacag dir, evc, zaad, registration fee…) |
| Layer 2 | Honeypot field — bots waa la diiday |
| Layer 3 | 24-saacadood delay — isticmaalayaasha cusub |
| Layer 4 | Max 3 post/maalin — rate limiting |
| Auto-flag | 3+ reports → shaqada waa la qarin |
| Auto-archive | 90 maalmood → shaqada waa la kaydsan |
| Trust Score | +20 signup, +10 job post, -30 reported |
| RLS | Row Level Security dhammaan tables |

---

## Xog Muhiim Ah

**Dhammaan features-ku waa shaqaynayaan bilaash:**
- ✅ Supabase Free Tier (500MB DB, 1GB storage, 50k auth users)
- ✅ Vercel Free Tier (unlimited deployments)
- ✅ GitHub Free
- ✅ No paid APIs
