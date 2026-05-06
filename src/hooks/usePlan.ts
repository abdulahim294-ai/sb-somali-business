import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getPlan, type PlanId, type Plan } from "@/lib/plans";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

/**
 * Returns the current user's plan + helper booleans.
 * Falls back to "free" if no profile/plan is set.
 */
export function usePlan(): {
  plan: Plan;
  planId: PlanId;
  isFree: boolean;
  isPaid: boolean;
  loading: boolean;
} {
  const { profile, loading } = useAuth();
  const planId = (profile?.plan as PlanId) || "free";
  const plan = getPlan(planId);
  return {
    plan,
    planId: plan.id,
    isFree: plan.id === "free",
    isPaid: plan.id !== "free",
    loading,
  };
}

/** Checks whether the user can post more jobs this month. */
export function useCanPost(): boolean {
  const { profile } = useAuth();
  const { plan } = usePlan();
  if (!profile) return false;
  const limit = plan.limits.jobsPerMonth;
  if (limit < 0) return true;
  const today = new Date().toISOString().split("T")[0];
  const resetMonth =
    !profile.last_post_date ||
    profile.last_post_date.substring(0, 7) !== today.substring(0, 7);
  const used = resetMonth ? 0 : (profile.posts_today ?? 0);
  return used < limit;
}

/** Checks whether the user can submit more job applications this month. */
export function useCanApply(): boolean {
  const { profile } = useAuth();
  const { plan } = usePlan();
  if (!profile) return false;
  const limit = plan.limits.appsPerMonth;
  if (limit < 0) return true;
  const today = new Date().toISOString().split("T")[0];
  const resetMonth =
    !profile.last_app_date ||
    profile.last_app_date.substring(0, 7) !== today.substring(0, 7);
  const used = resetMonth ? 0 : (profile.apps_today ?? 0);
  return used < limit;
}

/** Mutation to update the user's plan in Supabase. */
export function useUpgradePlan() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { user, refresh } = useAuth();

  return useMutation({
    mutationFn: async (planId: PlanId) => {
      if (!user) throw new Error("Soo gal ka hor.");
      const { error } = await supabase
        .from("profiles")
        .update({ plan: planId, plan_started_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw new Error(error.message);
      return planId;
    },
    onSuccess: async (planId) => {
      await refresh();
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Qorshaha waa la cusbooneysiiyay",
        description: `Hadda waxaad isticmaalaysaa qorshaha ${getPlan(planId).name}.`,
        variant: "success",
      });
    },
    onError: (e: Error) =>
      toast({
        title: "Cillad",
        description: e.message,
        variant: "destructive",
      }),
  });
}
