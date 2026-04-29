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
  // `plan` may not exist on older profile rows — default to "free"
  const planId = ((profile as any)?.plan as PlanId) || "free";
  const plan = getPlan(planId);
  return {
    plan,
    planId: plan.id,
    isFree: plan.id === "free",
    isPaid: plan.id !== "free",
    loading,
  };
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
