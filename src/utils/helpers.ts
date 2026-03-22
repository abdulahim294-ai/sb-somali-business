import { formatDistanceToNow, format } from "date-fns";
import type { Job } from "@/lib/supabase";

export const timeAgo = (d: string) => { try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } catch { return "Dhowaan"; } };
export const fmtDate = (d: string) => { try { return format(new Date(d), "MMM d, yyyy"); } catch { return d; } };

export function shareJobWA(job: Job) {
  const url  = `${window.location.origin}/jobs/${job.id}`;
  const body = `🇸🇴 *SB Somali Business*\n\n📌 *${job.title}*\n🏢 ${job.company}\n📍 ${job.location}${job.salary ? `\n💰 ${job.salary}` : ""}\n\n🔗 ${url}\n\n_Ha u dirin lacag shaqo la'aanta!_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
}

export function contactEmployerWA(phone: string, jobTitle: string) {
  const num = phone.replace(/\D/g, "");
  const msg = `Salaan! Waxaan arkay xayeysiiskaaga shaqada "${jobTitle}" SB Somali Business. Waxaan xiiseynayaa.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

export const JOB_TYPES = ["Full-time","Part-time","Remote","Project","Internship"] as const;
export const JOB_TYPE_LABELS: Record<string,string> = { "Full-time":"Shaqo Buuxda","Part-time":"Qaybeed","Remote":"Fog (Online)","Project":"Mashruuc","Internship":"Tababar" };
export const LOCATIONS = ["Mogadishu","Hargeisa","Bosaso","Kismayo","Baidoa","Garowe","Berbera","Remote"];
