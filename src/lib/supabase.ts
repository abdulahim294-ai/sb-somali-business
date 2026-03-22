import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — copy .env.example to .env");

export const supabase = createClient(url, key, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
});

// ── Types ──────────────────────────────────────────────────────

export interface Profile {
  id: string; full_name: string | null; email: string;
  phone: string | null; city: string | null; bio: string | null;
  avatar_url: string | null; trust_score: number;
  is_verified: boolean; is_banned: boolean;
  posts_today: number; last_post_date: string | null;
  created_at: string; updated_at: string;
}

export interface Job {
  id: string; user_id: string | null;
  title: string; company: string; location: string; type: string;
  salary: string | null; description: string;
  contact_whatsapp: string | null; contact_email: string | null;
  status: string; is_verified: boolean; is_flagged: boolean;
  is_archived: boolean; report_count: number; view_count: number;
  spam_score: number; posted_at: string; expires_at: string | null;
  // joined from view
  poster_name?: string | null; poster_trust_score?: number;
  poster_is_verified?: boolean; poster_is_banned?: boolean;
}

export interface Freelancer {
  id: string; user_id: string | null;
  name: string; role: string; location: string; rating: string;
  contact_whatsapp: string | null; contact_email: string | null;
  skills: string[] | null; is_verified: boolean; is_available: boolean;
  bio: string | null; portfolio_url: string | null; joined_at: string;
}

export type NewJob = {
  title: string; company: string; location: string; type: string;
  salary?: string | null; description: string;
  contact_whatsapp?: string | null; contact_email?: string | null;
  is_verified?: boolean;
};

export type NewFreelancer = Omit<Freelancer, "id" | "joined_at" | "user_id">;
