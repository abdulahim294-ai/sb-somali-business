-- ═══════════════════════════════════════════════════════════════════
--  SB SOMALI BUSINESS — Production Database Schema v2.0
--  Run the ENTIRE file in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─────────────────────────────────────────────────────────────────
-- PROFILES  (auto-created on signup via trigger)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  email           TEXT        UNIQUE NOT NULL,
  phone           TEXT,
  city            TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  trust_score     INTEGER     NOT NULL DEFAULT 20,
  is_verified     BOOLEAN     NOT NULL DEFAULT TRUE,
  is_banned       BOOLEAN     NOT NULL DEFAULT FALSE,
  posts_today     INTEGER     NOT NULL DEFAULT 0,
  last_post_date  DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- JOBS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.jobs (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID        REFERENCES public.profiles(id) ON DELETE CASCADE,
  title             TEXT        NOT NULL,
  company           TEXT        NOT NULL,
  location          TEXT        NOT NULL,
  type              TEXT        NOT NULL DEFAULT 'Full-time',
  salary            TEXT,
  description       TEXT        NOT NULL,
  contact_whatsapp  TEXT,
  contact_email     TEXT,
  status            TEXT        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','archived','flagged','deleted')),
  is_verified       BOOLEAN     NOT NULL DEFAULT FALSE,
  is_flagged        BOOLEAN     NOT NULL DEFAULT FALSE,
  is_archived       BOOLEAN     NOT NULL DEFAULT FALSE,
  report_count      INTEGER     NOT NULL DEFAULT 0,
  view_count        INTEGER     NOT NULL DEFAULT 0,
  spam_score        INTEGER     NOT NULL DEFAULT 0,
  posted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at        TIMESTAMPTZ          DEFAULT NOW() + INTERVAL '90 days',
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status   ON public.jobs(status, is_flagged, is_archived);
CREATE INDEX IF NOT EXISTS idx_jobs_posted   ON public.jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_user     ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_expires  ON public.jobs(expires_at);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs USING gin(location  gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_title    ON public.jobs USING gin(title     gin_trgm_ops);

-- ─────────────────────────────────────────────────────────────────
-- FREELANCERS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.freelancers (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  name              TEXT        NOT NULL,
  role              TEXT        NOT NULL,
  location          TEXT        NOT NULL DEFAULT 'Mogadishu',
  rating            TEXT                  DEFAULT '5.0',
  contact_whatsapp  TEXT,
  contact_email     TEXT,
  skills            TEXT[],
  is_verified       BOOLEAN     NOT NULL DEFAULT FALSE,
  is_available      BOOLEAN     NOT NULL DEFAULT TRUE,
  bio               TEXT,
  portfolio_url     TEXT,
  joined_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_freelancers_avail ON public.freelancers(is_available);
CREATE INDEX IF NOT EXISTS idx_freelancers_role  ON public.freelancers USING gin(role gin_trgm_ops);

-- ─────────────────────────────────────────────────────────────────
-- REPORTS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id      UUID        NOT NULL REFERENCES public.jobs(id)     ON DELETE CASCADE,
  reporter_id UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason      TEXT        NOT NULL,
  details     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, reporter_id)
);

CREATE INDEX IF NOT EXISTS idx_reports_job ON public.reports(job_id);

-- ─────────────────────────────────────────────────────────────────
-- BOOKMARKS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id     UUID        NOT NULL REFERENCES public.jobs(id)     ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- ─────────────────────────────────────────────────────────────────
-- ACTIVITY LOG  (audit trail)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  action     TEXT        NOT NULL,
  target_id  UUID,
  meta       JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
--  TRIGGER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════

-- 1. Auto-create profile row on every new auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, trust_score, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    20,
    TRUE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. When a report is filed: increment job's report_count,
--    auto-flag at 3 reports, deduct -30 trust from poster
CREATE OR REPLACE FUNCTION public.handle_new_report()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.jobs
  SET
    report_count = report_count + 1,
    is_flagged   = CASE WHEN report_count + 1 >= 3 THEN TRUE ELSE is_flagged END,
    status       = CASE WHEN report_count + 1 >= 3 THEN 'flagged' ELSE status END,
    updated_at   = NOW()
  WHERE id = NEW.job_id;

  -- Penalise poster
  UPDATE public.profiles
  SET
    trust_score = GREATEST(trust_score - 30, -100),
    updated_at  = NOW()
  WHERE id = (SELECT user_id FROM public.jobs WHERE id = NEW.job_id);

  -- Audit
  INSERT INTO public.activity_logs (action, target_id, meta)
  VALUES ('report_filed', NEW.job_id,
    jsonb_build_object('reason', NEW.reason, 'reporter', NEW.reporter_id));

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS after_report_insert ON public.reports;
CREATE TRIGGER after_report_insert
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_report();


-- 3. Award +10 trust on each job post; track daily posting count
CREATE OR REPLACE FUNCTION public.handle_job_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.profiles
  SET
    trust_score    = LEAST(trust_score + 10, 100),
    posts_today    = CASE
                       WHEN last_post_date = CURRENT_DATE THEN posts_today + 1
                       ELSE 1
                     END,
    last_post_date = CURRENT_DATE,
    updated_at     = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS after_job_insert ON public.jobs;
CREATE TRIGGER after_job_insert
  AFTER INSERT ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_job_insert();


-- 4. Auto-archive jobs older than 90 days
--    (run via Supabase cron / Edge Function scheduler)
CREATE OR REPLACE FUNCTION public.archive_expired_jobs()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE archived_count INTEGER;
BEGIN
  WITH archived AS (
    UPDATE public.jobs
    SET status = 'archived', is_archived = TRUE, updated_at = NOW()
    WHERE is_archived = FALSE
      AND status      = 'active'
      AND expires_at  < NOW()
    RETURNING id
  )
  SELECT COUNT(*) INTO archived_count FROM archived;
  RETURN archived_count;
END;
$$;


-- 5. View-count helper (called client-side, fire & forget)
CREATE OR REPLACE FUNCTION public.increment_job_view(p_job_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.jobs SET view_count = view_count + 1 WHERE id = p_job_id;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════
--  PUBLIC VIEW  (active, non-flagged, non-archived + poster info)
-- ═══════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW public.jobs_public AS
  SELECT
    j.id, j.user_id, j.title, j.company, j.location, j.type,
    j.salary, j.description, j.contact_whatsapp, j.contact_email,
    j.status, j.is_verified, j.is_flagged, j.is_archived,
    j.report_count, j.view_count, j.spam_score,
    j.posted_at, j.expires_at,
    p.full_name   AS poster_name,
    p.trust_score AS poster_trust_score,
    p.is_verified AS poster_is_verified,
    p.is_banned   AS poster_is_banned
  FROM public.jobs j
  LEFT JOIN public.profiles p ON p.id = j.user_id
  WHERE j.status      = 'active'
    AND j.is_flagged  = FALSE
    AND j.is_archived = FALSE
    AND (j.expires_at IS NULL OR j.expires_at > NOW());

GRANT SELECT ON public.jobs_public TO anon, authenticated;


-- ═══════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "profiles_read"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_read"   ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- jobs
DROP POLICY IF EXISTS "jobs_select" ON public.jobs;
DROP POLICY IF EXISTS "jobs_insert" ON public.jobs;
DROP POLICY IF EXISTS "jobs_update" ON public.jobs;
DROP POLICY IF EXISTS "jobs_delete" ON public.jobs;
CREATE POLICY "jobs_select" ON public.jobs FOR SELECT
  USING (status = 'active' AND is_flagged = FALSE AND is_archived = FALSE);
CREATE POLICY "jobs_insert" ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "jobs_update" ON public.jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "jobs_delete" ON public.jobs FOR DELETE USING (auth.uid() = user_id);

-- freelancers
DROP POLICY IF EXISTS "freelancers_select" ON public.freelancers;
DROP POLICY IF EXISTS "freelancers_insert" ON public.freelancers;
DROP POLICY IF EXISTS "freelancers_update" ON public.freelancers;
CREATE POLICY "freelancers_select" ON public.freelancers FOR SELECT USING (TRUE);
CREATE POLICY "freelancers_insert" ON public.freelancers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "freelancers_update" ON public.freelancers FOR UPDATE USING (auth.uid() = user_id);

-- reports
DROP POLICY IF EXISTS "reports_insert" ON public.reports;
DROP POLICY IF EXISTS "reports_select" ON public.reports;
CREATE POLICY "reports_insert" ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id AND auth.uid() IS NOT NULL);
CREATE POLICY "reports_select" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);

-- bookmarks
DROP POLICY IF EXISTS "bookmarks_all" ON public.bookmarks;
CREATE POLICY "bookmarks_all" ON public.bookmarks FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- activity_logs (no direct client access)
DROP POLICY IF EXISTS "logs_deny" ON public.activity_logs;
CREATE POLICY "logs_deny" ON public.activity_logs FOR SELECT USING (FALSE);


-- ═══════════════════════════════════════════════════════════════════
--  GRANTS
-- ═══════════════════════════════════════════════════════════════════

GRANT USAGE  ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles, public.freelancers TO anon;
GRANT SELECT ON public.jobs TO anon;
GRANT INSERT, UPDATE, DELETE ON public.jobs         TO authenticated;
GRANT INSERT, UPDATE          ON public.freelancers  TO authenticated;
GRANT INSERT                  ON public.reports      TO authenticated;
GRANT ALL                     ON public.bookmarks    TO authenticated;
GRANT UPDATE                  ON public.profiles     TO authenticated;
GRANT INSERT                  ON public.activity_logs TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_job_view(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.archive_expired_jobs()   TO authenticated;


-- ═══════════════════════════════════════════════════════════════════
--  SEED DATA  (remove in production if you want a clean start)
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO public.jobs
  (user_id,title,company,location,type,salary,description,contact_whatsapp,is_verified,status)
VALUES
(NULL,'Xisaabiye (Accountant)','Hormuud Telecom','Mogadishu','Full-time','$600–$900/bilood',
 E'Waxaan raadinaa xisaabiye khibrad leh.\n\nShuruudaha:\n• Degree Accounting\n• 2+ sano khibrad\n• Excel & QuickBooks\n\nXiriir WhatsApp.',
 '+252687076746',TRUE,'active'),
(NULL,'Naqshade Grafik','SomMedia','Mogadishu','Part-time','$400–$700/bilood',
 E'Naqshadeeye khibrad leh oo ku xirfadaysan Adobe Illustrator, Photoshop, iyo Figma.\nSoo dir portfolio-gaaga.',
 '+252687076746',TRUE,'active'),
(NULL,'Sales Manager','Jubba Airways','Hargeisa','Full-time','$800–$1,200/bilood',
 E'Sales manager loo baahan yahay Hargeisa.\nShuruudaha: 3+ sano khibrad, hogaamineed xoog leh.',
 '+252687076746',FALSE,'active'),
(NULL,'Web Developer (React)','TechSomalia','Remote','Remote','$500–$1,000/bilood',
 E'React iyo Node.js developer.\nShaqada waxaad ka qaban kartaa meel kasta.\nGitHub link soo dir.',
 '+252687076746',FALSE,'active'),
(NULL,'Dhakhtar (GP)','Daryeel Hospital','Mogadishu','Full-time','$1,000–$1,500/bilood',
 E'Dhakhtar la raadinayo.\nShuruudaha: MBBS degree + rukhsad Somalia + 2 sano khibrad.',
 '+252687076746',TRUE,'active'),
(NULL,'Macalin Xisaab','SomEd Academy','Mogadishu','Part-time','$300–$500/bilood',
 E'Macalin aqoon wanaagsan oo xisaabta ah oo loo baahan yahay fasalka sare.\nShahaadada waa laga baahan yahay.',
 '+252687076746',FALSE,'active'),
(NULL,'Digital Marketing Manager','Somtelecom','Hargeisa','Full-time','$700–$1,000/bilood',
 E'Social media iyo digital marketing manager.\n2+ sano khibrad. Google Ads & Meta Ads.',
 '+252687076746',FALSE,'active'),
(NULL,'Darawal / Driver','Dalsan Group','Mogadishu','Full-time','$300–$450/bilood',
 E'Darawal baahi la leh oo u shaqayn kara shirkadda.\nLaisanka waa lagama maarmaan ah.',
 '+252687076746',FALSE,'active')
ON CONFLICT DO NOTHING;

INSERT INTO public.freelancers
  (name,role,location,rating,contact_whatsapp,skills,is_verified,is_available,bio)
VALUES
('Xasan Maxamed','Web Developer','Mogadishu','4.9','+252615000001',
 ARRAY['React','Node.js','TypeScript','Tailwind','PostgreSQL'],TRUE,TRUE,
 'Full-stack developer 4 sano oo khibrad ah. Web apps & mobile apps.'),
('Faadumo Cali','Graphic Designer','Hargeisa','5.0','+252615000002',
 ARRAY['Photoshop','Illustrator','Figma','Branding','UI/UX'],TRUE,TRUE,
 'Naqshadeeye xirfad leh. Ganacsiyada waaweyn Soomaaliya.'),
('Cabdi Warsame','Digital Marketer','Mogadishu','4.7','+252615000003',
 ARRAY['SEO','Social Media','Facebook Ads','Content','Google Ads'],FALSE,TRUE,
 'Digital marketer khibrad leh. Kor u qaadi karaa ganacsigaaga online.'),
('Sahra Maxamuud','Video Editor','Bosaso','4.8','+252615000004',
 ARRAY['Premiere Pro','After Effects','YouTube','Color Grading'],TRUE,FALSE,
 'Muuqaal tifaftire ah. Viidiyooyinka xirfadlaha ah.'),
('Muuse Ismaciil','Translator','Mogadishu','5.0','+252615000005',
 ARRAY['Somali','Arabic','English','French','Legal Translation'],TRUE,TRUE,
 'Turjubaan khibrad leh. Dukumiintiyada rasmiga ah.'),
('Shamso Yuusuf','Accountant','Hargeisa','4.6','+252615000006',
 ARRAY['QuickBooks','Excel','IFRS','Taxation','Payroll'],FALSE,TRUE,
 'Xisaabiye khibrad leh. Ganacsiyada yaryar & dhexdhexaadka ah.')
ON CONFLICT DO NOTHING;
