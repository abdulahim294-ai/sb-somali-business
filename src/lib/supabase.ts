import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_CONFIGURED = Boolean(url && key);

if (!SUPABASE_CONFIGURED && typeof window !== "undefined") {
  // Soft warning so the app still boots in preview without crashing.
  // Real auth/data calls will return errors handled by hooks.
  console.warn(
    "[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. " +
      "Auth & data features are disabled until you configure them in .env."
  );
}

export const supabase: SupabaseClient = createClient(
  url ?? "https://placeholder.supabase.co",
  key ?? "placeholder-anon-key",
  {
    auth: {
      autoRefreshToken: SUPABASE_CONFIGURED,
      persistSession: SUPABASE_CONFIGURED,
      detectSessionInUrl: SUPABASE_CONFIGURED,
    },
  }
);

// ── Types ──────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  bio: string | null;
  avatar_url: string | null;
  trust_score: number;
  is_verified: boolean;
  is_banned: boolean;
  posts_today: number;
  last_post_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string | null;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string | null;
  description: string;
  contact_whatsapp: string | null;
  contact_email: string | null;
  status: string;
  is_verified: boolean;
  is_flagged: boolean;
  is_archived: boolean;
  report_count: number;
  view_count: number;
  spam_score: number;
  posted_at: string;
  expires_at: string | null;
  // joined from view
  poster_name?: string | null;
  poster_trust_score?: number;
  poster_is_verified?: boolean;
  poster_is_banned?: boolean;
}

export interface Freelancer {
  id: string;
  user_id: string | null;
  name: string;
  role: string;
  location: string;
  rating: string;
  contact_whatsapp: string | null;
  contact_email: string | null;
  skills: string[] | null;
  is_verified: boolean;
  is_available: boolean;
  bio: string | null;
  portfolio_url: string | null;
  joined_at: string;
}

export type NewJob = {
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string | null;
  description: string;
  contact_whatsapp?: string | null;
  contact_email?: string | null;
  is_verified?: boolean;
};

export type NewFreelancer = Omit<Freelancer, "id" | "joined_at" | "user_id">;
