import { Crown, Sparkles, Star, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Plan } from "@/lib/plans";

const ICONS = {
  free: Circle,
  basic: Star,
  free_pro: Sparkles,
  premium: Crown,
} as const;

const STYLES = {
  free: "bg-slate-100 text-slate-600 border-slate-200",
  basic: "bg-primary/10 text-primary border-primary/20",
  free_pro: "bg-amber-50 text-amber-700 border-amber-200",
  premium:
    "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/30",
} as const;

export function PlanBadge({
  plan,
  size = "sm",
  showLabel = true,
  className,
}: {
  plan: Plan;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}) {
  const Icon = ICONS[plan.id];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold",
        STYLES[plan.id],
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        className
      )}
      title={`Qorshaha: ${plan.name}`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {showLabel && plan.name}
    </span>
  );
}
