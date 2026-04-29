// Subscription plan definitions for SB Somali Business marketplace.
// Stored on `profiles.plan` (string: "free" | "basic" | "free_pro" | "premium").

export type PlanId = "free" | "basic" | "free_pro" | "premium";

export interface PlanLimits {
  /** -1 = unlimited */
  jobsPerMonth: number;
  /** -1 = unlimited */
  appsPerMonth: number;
  /** higher = appears higher in listings */
  priorityRank: number;
  canSelfVerify: boolean;
  advancedProfile: boolean;
  premiumBadge: boolean;
  prioritySupport: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  nameSo: string;
  tagline: string;
  /** monthly USD price */
  price: number;
  /** small label shown above the price (e.g. "Caan ah") */
  badge?: string;
  /** Highlight as the recommended plan in the pricing grid */
  highlight?: boolean;
  features: { text: string; included: boolean }[];
  limits: PlanLimits;
  ctaLabel: string;
  accent: "slate" | "primary" | "emerald" | "amber";
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    nameSo: "Bilaash",
    tagline: "Bilow caafimaad ah — bilaa lacag.",
    price: 0,
    accent: "slate",
    ctaLabel: "Bilow bilaash",
    features: [
      { text: "Ilaa 3 shaqo bishii", included: true },
      { text: "Ilaa 5 codsi bishii", included: true },
      { text: "Profile aasaasi ah", included: true },
      { text: "Wax soo dhicis aamin ah", included: true },
      { text: "Mudnaan liiska", included: false },
      { text: "Calaamad la xaqiijiyay", included: false },
      { text: "Taageero degdeg ah", included: false },
    ],
    limits: {
      jobsPerMonth: 3,
      appsPerMonth: 5,
      priorityRank: 0,
      canSelfVerify: false,
      advancedProfile: false,
      premiumBadge: false,
      prioritySupport: false,
    },
  },
  {
    id: "basic",
    name: "Basic",
    nameSo: "Aasaasi",
    tagline: "Tallaabada koowaad ee horumarka.",
    price: 5,
    accent: "primary",
    ctaLabel: "Bilow Basic",
    features: [
      { text: "Ilaa 15 shaqo bishii", included: true },
      { text: "Ilaa 30 codsi bishii", included: true },
      { text: "Liiska sare ee 'Basic+'", included: true },
      { text: "Statistics aasaasi ah", included: true },
      { text: "Profile khibrad oo dheeri ah", included: true },
      { text: "Calaamad la xaqiijiyay", included: false },
      { text: "Taageero degdeg ah", included: false },
    ],
    limits: {
      jobsPerMonth: 15,
      appsPerMonth: 30,
      priorityRank: 1,
      canSelfVerify: false,
      advancedProfile: true,
      premiumBadge: false,
      prioritySupport: false,
    },
  },
  {
    id: "free_pro",
    name: "Free Pro",
    nameSo: "Free Pro (Lab-dhinac)",
    tagline:
      "Hal xisaab oo isku xirta ganacsi & xirfadle — $4.99 ganacsi + $4.99 xirfadle.",
    price: 9.99,
    badge: "Caan ah",
    highlight: true,
    accent: "amber",
    ctaLabel: "Bilow Free Pro",
    features: [
      { text: "Ilaa 30 shaqo bishii", included: true },
      { text: "Ilaa 60 codsi bishii", included: true },
      { text: "Mudnaan liiska — bayaan dheeri ah", included: true },
      { text: "Profile khibrad oo dheeri ah", included: true },
      { text: "Calaamad 'Pro' xirfadlaha", included: true },
      { text: "Heshiis labada-dhinac (ganacsi + xirfadle)", included: true },
      { text: "Taageero email ah", included: true },
    ],
    limits: {
      jobsPerMonth: 30,
      appsPerMonth: 60,
      priorityRank: 2,
      canSelfVerify: true,
      advancedProfile: true,
      premiumBadge: false,
      prioritySupport: false,
    },
  },
  {
    id: "premium",
    name: "Premium",
    nameSo: "Premium (Sare)",
    tagline: "Buuxda. Xaddidnaan ma jirto.",
    price: 10,
    accent: "emerald",
    ctaLabel: "Bilow Premium",
    features: [
      { text: "Shaqo aan xaddidnayn", included: true },
      { text: "Codsi aan xaddidnayn", included: true },
      { text: "Meesha kowaad ee liiska", included: true },
      { text: "Calaamad 'Premium' qaab gaar ah", included: true },
      { text: "Profile khibrad oo buuxa", included: true },
      { text: "Xaqiijin si toos ah", included: true },
      { text: "Taageero degdeg ah 24/7", included: true },
    ],
    limits: {
      jobsPerMonth: -1,
      appsPerMonth: -1,
      priorityRank: 3,
      canSelfVerify: true,
      advancedProfile: true,
      premiumBadge: true,
      prioritySupport: true,
    },
  },
];

export const PLAN_MAP: Record<PlanId, Plan> = PLANS.reduce(
  (acc, p) => ({ ...acc, [p.id]: p }),
  {} as Record<PlanId, Plan>
);

export function getPlan(id?: string | null): Plan {
  if (!id) return PLAN_MAP.free;
  return PLAN_MAP[id as PlanId] ?? PLAN_MAP.free;
}

export function isUnlimited(n: number) {
  return n < 0;
}

export function formatLimit(n: number) {
  return isUnlimited(n) ? "Aan xaddidnayn" : `${n}`;
}

/**
 * Comparison rows for the pricing table — kept in one place to keep the
 * Pricing page focused on layout.
 */
export const COMPARISON_ROWS: {
  label: string;
  value: (p: Plan) => string;
}[] = [
  { label: "Shaqo / bil", value: (p) => formatLimit(p.limits.jobsPerMonth) },
  { label: "Codsi / bil", value: (p) => formatLimit(p.limits.appsPerMonth) },
  {
    label: "Mudnaan liiska",
    value: (p) =>
      p.limits.priorityRank === 0
        ? "—"
        : p.limits.priorityRank === 1
          ? "Heer 1"
          : p.limits.priorityRank === 2
            ? "Heer 2"
            : "Heer ugu sarreeya",
  },
  {
    label: "Profile khibrad",
    value: (p) => (p.limits.advancedProfile ? "Haa" : "Maya"),
  },
  {
    label: "Calaamad la xaqiijiyay",
    value: (p) =>
      p.limits.premiumBadge
        ? "Premium"
        : p.limits.canSelfVerify
          ? "Pro"
          : "—",
  },
  {
    label: "Taageero",
    value: (p) =>
      p.limits.prioritySupport
        ? "24/7 degdeg"
        : p.id === "free_pro"
          ? "Email"
          : "Aasaasi",
  },
];
