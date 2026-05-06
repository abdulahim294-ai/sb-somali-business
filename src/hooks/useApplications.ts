import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, type Application, type NewApplication } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

async function fetchMyApplications(uid: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*, jobs(title, company)")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Application[];
}

async function fetchJobApplications(jobId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Application[];
}

async function createApplication(input: NewApplication): Promise<Application> {
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

async function withdrawApplication(id: string) {
  const { error } = await supabase
    .from("applications")
    .update({ status: "withdrawn", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

async function updateApplicationStatus(id: string, status: Application["status"]) {
  const { error } = await supabase
    .from("applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export const useMyApplications = (uid: string | null) =>
  useQuery({
    queryKey: ["applications", uid],
    queryFn: () => fetchMyApplications(uid!),
    enabled: !!uid,
    staleTime: 30_000,
  });

export const useJobApplications = (jobId: string | null) =>
  useQuery({
    queryKey: ["job-applications", jobId],
    queryFn: () => fetchJobApplications(jobId!),
    enabled: !!jobId,
    staleTime: 30_000,
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

export function useWithdrawApplication() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => withdrawApplication(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      toast({ title: "Codsiga waa la joojiyay", variant: "success" });
    },
    onError: (e: Error) =>
      toast({
        title: "Khalad",
        description: e.message,
        variant: "destructive",
      }),
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Application["status"] }) =>
      updateApplicationStatus(id, status),
    onSuccess: (_, { status }) => {
      qc.invalidateQueries({ queryKey: ["job-applications"] });
      qc.invalidateQueries({ queryKey: ["applications"] });
      toast({
        title:
          status === "accepted"
            ? "Codsiga waa la aqbalay ✓"
            : status === "rejected"
              ? "Codsiga waa la diiday"
              : "Xaaladda waa la cusbooneysiiyay",
        variant: status === "accepted" ? "success" : "default",
      });
    },
    onError: (e: Error) =>
      toast({ title: "Khalad", description: e.message, variant: "destructive" }),
  });
}
