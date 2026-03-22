export type TrustLevel = "high" | "medium" | "low" | "bad";

export function getTrustLevel(score: number): TrustLevel {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  if (score >= 0)  return "low";
  return "bad";
}

export interface TrustInfo { level: TrustLevel; cls: string; label: string; icon: string; tip: string; }

const MAP: Record<TrustLevel, TrustInfo> = {
  high:   { level:"high",   cls:"trust-high",   label:"La Aaminsan Yahay ✓", icon:"✓", tip:"Taariikh wanaagsan. Aaminsan." },
  medium: { level:"medium", cls:"trust-medium",  label:"La Xaqiijiyey",        icon:"◎", tip:"Xaqiijiyey laakiin taariikhdoodu yaraa." },
  low:    { level:"low",    cls:"trust-low",     label:"Isticmaale Cusub",      icon:"○", tip:"Cusub — taxadar. Ha lacag u dirin." },
  bad:    { level:"bad",    cls:"trust-bad",     label:"⚠ Laga Shakiyay",      icon:"!", tip:"🚨 Ha la macaamilin — waxaa laga shakiyaa." },
};

export function getTrustInfo(score: number): TrustInfo { return MAP[getTrustLevel(score)]; }

export const SCAM_TIPS = [
  "🚨 Ha u dirin lacag shaqo la'aanta — Shaqo dhabtu ma baahidaan lacag hore",
  "📵 Shaqaale caddaalad ahi kuma weydiistaan EVC Plus, ZAAD, ama Sahal",
  "🔒 'Registration fee' weydiisasho — calaamad khayaano ah",
  "✅ Xaqiiji shirkadda ka hor inta aadan macluumaadkaaga bixin",
];

export const REPORT_REASONS = [
  { value:"scam",       label:"Khayaano / Dooxis (Scam)" },
  { value:"money",      label:"Lacag ayay weydiisanayaan (EVC/ZAAD)" },
  { value:"fake",       label:"Shirkad / Qof been ah" },
  { value:"wrong_info", label:"Macluumaad khaldan" },
  { value:"spam",       label:"Spam ama xayeysiis" },
  { value:"other",      label:"Sabab kale" },
];
