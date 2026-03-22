// ═══════════════════════════════════════════════════════════
//  ANTI-SCAM ENGINE — 4 Layers of Protection
//  Layer 1: Keyword + pattern blocklist
//  Layer 2: Honeypot (bot trap)
//  Layer 3: 24-hour account age gate
//  Layer 4: Daily rate limit (max 3 posts / day)
// ═══════════════════════════════════════════════════════════

const BLOCKED: string[] = [
  // Mobile money scam
  "lacag dir","lacag-dir","lacagdir","dir lacag","lacag bixin","dib u dir lacag",
  "evc plus","evc-plus","evcplus","evc","zaad","sahal","e-dahab","edahab",
  "premier wallet","soltelco","telesom",
  // Fee scams (Somali)
  "registration fee","diiwaan gelin lacag","diiwaangelinta lacag","lacagta diiwaangelinta",
  "bixi lacag","lacag diiwaangelin","fee diiwaangelinta",
  // Fee scams (English)
  "admin fee","processing fee","upfront fee","upfront payment",
  "advance payment","deposit required","pay to apply","pay first","pay before",
  "registration cost","application fee",
  // Somali scam phrases
  "dhibco dir","dhibco","xawaaladda dir","kaydso lacag",
  // Money transfer
  "wire transfer","western union","moneygram","world remit",
  "send money","send cash","transfer money","money transfer",
  // Crypto
  "bitcoin","crypto payment","usdt","tether","binance pay","eth payment",
  "cryptocurrency","pay in crypto",
  // Gift cards
  "gift card","itunes card","amazon card","steam card",
  // MLM / pyramid
  "pyramid","mlm","multi-level","network marketing","downline","recruit members",
  // Fake income promises
  "guaranteed income","unlimited income","make money fast","get rich quick",
  "earn $500 daily","earn $1000","per day guaranteed","100% guaranteed income",
  "no experience needed earn","work from home $500","work from home $1000",
  "passive income guaranteed",
];

const PATTERNS: RegExp[] = [
  /\bpay\s+(first|before|upfront|deposit)/i,
  /100\s*%\s*(guaranteed|guarantee)/i,
  /fee\s*(required|needed|mandatory)/i,
  /send\s+\$?\d+/i,
  /lacag\s+\d+/i,
  /\$\d{3,}\s*(per\s+day|daily|a\s+day)/i,
  /earn\s+\$\d+\s*(per|a)\s+(day|week|hour)/i,
  /(register|apply)\s+(for\s+)?only\s+\$?\d+/i,
  /fee\s*[:=]\s*\$?\d+/i,
];

export interface FilterResult {
  passed: boolean;
  severity: "clean" | "suspicious" | "blocked";
  matched: string[];
  score: number;
}

/** Layer 1 — Keyword + Pattern scan */
export function filterJobPost(f: { title: string; description: string; company?: string }): FilterResult {
  const text = [f.title, f.description, f.company ?? ""].join(" ").toLowerCase().normalize("NFC");
  const matched: string[] = [];
  let score = 0;

  for (const kw of BLOCKED) {
    if (text.includes(kw)) { matched.push(kw); score += kw.split(" ").length > 2 ? 50 : 30; }
  }
  for (const re of PATTERNS) {
    if (re.test(text)) { matched.push(re.source); score += 35; }
  }

  // Heuristics
  if ((f.description.match(/!/g) ?? []).length > 6) score += 12;
  if ((f.title.match(/[A-Z]/g) ?? []).length / Math.max(f.title.length, 1) > 0.6) score += 15;

  // Duplicate-sentence check (copypaste spam)
  const sents = f.description.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 10);
  if (sents.length > 3 && new Set(sents.map(s => s.toLowerCase())).size / sents.length < 0.6) score += 20;

  score = Math.min(score, 100);
  const severity: FilterResult["severity"] = score >= 40 ? "blocked" : score >= 18 ? "suspicious" : "clean";
  return { passed: severity !== "blocked", severity, matched, score };
}

/** Layer 2 — Honeypot: returns true if bot filled the hidden field */
export function isHoneypotFilled(v: string): boolean { return v.trim().length > 0; }

/** Layer 3 — 24-hour account age gate */
export function canPostNow(createdAt: string): { allowed: boolean; hoursLeft: number } {
  const h = (Date.now() - new Date(createdAt).getTime()) / 3_600_000;
  return h >= 24 ? { allowed: true, hoursLeft: 0 } : { allowed: false, hoursLeft: Math.ceil(24 - h) };
}

/** Layer 4 — Daily rate limit (max 3 posts per day) */
export function isRateLimited(postsToday: number, lastPostDate: string | null): boolean {
  if (!lastPostDate) return false;
  const isToday = new Date(lastPostDate).toDateString() === new Date().toDateString();
  return isToday && postsToday >= 3;
}

/** Human-readable error messages (Somali) */
export function getFilterMessage(r: FilterResult): string {
  if (r.severity === "blocked") {
    const kws = r.matched.filter(m => !m.includes("(")).slice(0, 3).join(", ");
    return `Ogeysiiskan waa la diidey — waxaa ku jira erayada khayaanada ah: "${kws}". ` +
      `Shaqo dhabtu ma baahidaan EVC, ZAAD, registration fee, ama lacag kasta oo hore.`;
  }
  if (r.severity === "suspicious")
    return "Ogeysiiskan waxaa ku jira qaar laga shakiyay. Fadlan hub inaadan lacag u dirin shaqaalaha.";
  return "";
}

/** Strip HTML / JS from user input */
export function sanitize(s: string): string {
  return s.trim()
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .slice(0, 6000);
}
