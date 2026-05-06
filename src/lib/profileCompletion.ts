import type { Profile, Freelancer } from "@/lib/supabase";

export interface CompletionItem {
  label: string;
  done: boolean;
  href?: string;
}

/**
 * Calculates profile completion percentage + items list.
 * Used in Dashboard for the progress bar.
 */
export function getProfileCompletion(
  profile: Profile | null,
  freelancer: Freelancer | null | undefined
): { pct: number; items: CompletionItem[]; missing: CompletionItem[] } {
  if (!profile) return { pct: 0, items: [], missing: [] };

  const items: CompletionItem[] = [
    {
      label: "Magac buux",
      done: !!profile.full_name?.trim(),
      href: "/settings",
    },
    {
      label: "Telefoon / WhatsApp",
      done: !!profile.phone?.trim(),
      href: "/settings",
    },
    {
      label: "Magaalo / Degaan",
      done: !!profile.city?.trim(),
      href: "/settings",
    },
    {
      label: "Faahfaahin naftaada (Bio)",
      done: !!profile.bio?.trim(),
      href: "/settings",
    },
    {
      label: "Profile xirfadle",
      done: !!freelancer,
      href: "/create-profile",
    },
    {
      label: "Kalsooni aqoonsi (Trust 40+)",
      done: (profile.trust_score ?? 0) >= 40,
      href: "/post-job",
    },
  ];

  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  const missing = items.filter((i) => !i.done);

  return { pct, items, missing };
}
