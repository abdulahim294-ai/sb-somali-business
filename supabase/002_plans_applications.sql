-- ═══════════════════════════════════════════════════════════════════
--  SB SOMALI BUSINESS — Migration v2.1
--  Add: plan fields, applications, reviews
--  Run after 001_initial.sql
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- PROFILES — add plan fields
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free','basic','free_pro','premium')),
  ADD COLUMN IF NOT EXISTS plan_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS apps_today INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_app_date DATE;

-- ─────────────────────────────────────────────────────────────────
-- APPLICATIONS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id            UUID        NOT NULL REFERENCES public.jobs(id)     ON DELETE CASCADE,
  user_id           UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter      TEXT,
  contact_whatsapp  TEXT,
  contact_email     TEXT,
  status            TEXT        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','seen','accepted','rejected','withdrawn')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job    ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user   ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- ─────────────────────────────────────────────────────────────────
-- REVIEWS / RATINGS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id       UUID        REFERENCES public.jobs(id) ON DELETE SET NULL,
  reviewer_id  UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id  UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating       INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_job      ON public.reviews(job_id);

-- ─────────────────────────────────────────────────────────────────
-- TRIGGER: track applications per user (daily)
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_application()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.profiles
  SET
    apps_today    = CASE
                      WHEN last_app_date = CURRENT_DATE THEN apps_today + 1
                      ELSE 1
                    END,
    last_app_date = CURRENT_DATE,
    updated_at    = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS after_application_insert ON public.applications;
CREATE TRIGGER after_application_insert
  AFTER INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_application();

-- ─────────────────────────────────────────────────────────────────
-- TRIGGER: update trust score on new review
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_review()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE avg_rating NUMERIC;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM public.reviews WHERE reviewee_id = NEW.reviewee_id;

  -- Boost trust score based on rating (max +5 per review)
  UPDATE public.profiles
  SET
    trust_score = LEAST(trust_score + GREATEST(NEW.rating - 2, 0) * 2, 100),
    updated_at  = NOW()
  WHERE id = NEW.reviewee_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS after_review_insert ON public.reviews;
CREATE TRIGGER after_review_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_review();

-- ─────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews      ENABLE ROW LEVEL SECURITY;

-- Applications: applicant can see own; job owner can see theirs
DROP POLICY IF EXISTS "applications_insert" ON public.applications;
DROP POLICY IF EXISTS "applications_select" ON public.applications;
DROP POLICY IF EXISTS "applications_update" ON public.applications;

CREATE POLICY "applications_insert" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "applications_select" ON public.applications
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT user_id FROM public.jobs WHERE id = job_id LIMIT 1)
  );

CREATE POLICY "applications_update" ON public.applications
  FOR UPDATE USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT user_id FROM public.jobs WHERE id = job_id LIMIT 1)
  );

-- Reviews: anyone can read; only reviewer can write
DROP POLICY IF EXISTS "reviews_select" ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert" ON public.reviews;

CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_insert" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ─────────────────────────────────────────────────────────────────
-- GRANTS
-- ─────────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;
GRANT SELECT, INSERT         ON public.reviews      TO authenticated;
