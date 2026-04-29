import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  cover_letter: string | null;
  contact_whatsapp: string | null;
  contact_email: string | null;
  status: string;
  created_at: string;
}

export interface NewApplication {
  job_id: string;
  user_id: string;
  cover_letter?: string | null;
  contact_whatsapp?: string | null;
  contact_email?: string | null;
}

async function fetchMyApplications(uid: string) {
  const { data, error } = await supabase
    .from("applications")
    .select("*, jobs(title, company)")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) return [] as Application[];
  return (data ?? []) as Application[];
}

async function createApplication(input: NewApplication) {
  const { data, error } = await supabase
    .from("applications")
    .insert([{ ...input, status: "pending" }])
    .select()
    .single();
  if (error?.code === "23505")
    throw new Error("Mar hore ayaad u codsatay shaqadan.");
  if (error) throw new Error(error.message);
  return data as Application;
}

export const useMyApplications = (uid: string | null) =>
  useQuery({
    queryKey: ["applications", uid],
    queryFn: () => fetchMyApplications(uid!),
    enabled: !!uid,
  });

export function useApplyToJob() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: NewApplication) => createApplication(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      toast({
        title: "Codsigaaga waa la diray",
        description: "Daabaciyaha shaqada ayaa kuula soo xiriiri doona.",
        variant: "success",
      });
    },
    onError: (e: Error) =>
      toast({
        title: "Codsi lama dirin",
        description: e.message,
        variant: "destructive",
      }),
  });
}
