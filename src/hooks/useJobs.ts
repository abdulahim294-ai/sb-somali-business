import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type Job, type NewJob } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

// ── Data fetchers ──────────────────────────────────────────────

async function fetchJobs(f: { search?: string; location?: string; type?: string }) {
  let q = supabase.from("jobs_public").select("*").order("posted_at", { ascending: false });
  if (f.search?.trim()) { const s = f.search.trim(); q = q.or(`title.ilike.%${s}%,company.ilike.%${s}%,description.ilike.%${s}%`); }
  if (f.location && f.location !== "all") q = q.ilike("location", `%${f.location}%`);
  if (f.type     && f.type !== "all")     q = q.eq("type", f.type);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as Job[];
}

async function fetchJob(id: string): Promise<Job|null> {
  const { data, error } = await supabase.from("jobs_public").select("*").eq("id", id).single();
  if (error) return null;
  supabase.rpc("increment_job_view", { p_job_id: id });
  return data as Job;
}

async function fetchMyJobs(uid: string) {
  const { data, error } = await supabase.from("jobs").select("*").eq("user_id", uid).order("posted_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Job[];
}

async function fetchBookmarks(uid: string) {
  const { data, error } = await supabase.from("bookmarks").select("job_id, jobs_public(*)").eq("user_id", uid);
  if (error) return [] as Job[];
  return ((data ?? []).map((b: any) => b.jobs_public).filter(Boolean)) as Job[];
}

// ── Mutations ──────────────────────────────────────────────────

async function createJob(input: NewJob & { user_id: string }) {
  const { data, error } = await supabase.from("jobs")
    .insert([{ ...input, status:"active", is_verified:false, is_flagged:false, is_archived:false, report_count:0 }])
    .select().single();
  if (error) throw new Error(error.message);
  return data as Job;
}

async function deleteJob(id: string) {
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

async function reportJob(jobId: string, reporterId: string, reason: string, details?: string) {
  const { error } = await supabase.from("reports")
    .insert([{ job_id:jobId, reporter_id:reporterId, reason, details: details ?? null }]);
  if (error?.code === "23505") throw new Error("Aad hore u soo sheegteen shaqadan.");
  if (error) throw new Error(error.message);
}

async function toggleBookmark(uid: string, jobId: string): Promise<boolean> {
  const { data: ex } = await supabase.from("bookmarks").select("id").eq("user_id", uid).eq("job_id", jobId).maybeSingle();
  if (ex) { await supabase.from("bookmarks").delete().eq("user_id", uid).eq("job_id", jobId); return false; }
  await supabase.from("bookmarks").insert([{ user_id:uid, job_id:jobId }]);
  return true;
}

// ── Hooks ──────────────────────────────────────────────────────

export const useJobs      = (f: { search?: string; location?: string; type?: string } = {}) =>
  useQuery({ queryKey:["jobs",f], queryFn:()=>fetchJobs(f), staleTime:30_000 });

export const useJob       = (id: string) =>
  useQuery({ queryKey:["job",id], queryFn:()=>fetchJob(id), enabled:!!id });

export const useMyJobs    = (uid: string|null) =>
  useQuery({ queryKey:["my-jobs",uid], queryFn:()=>fetchMyJobs(uid!), enabled:!!uid });

export const useBookmarks = (uid: string|null) =>
  useQuery({ queryKey:["bookmarks",uid], queryFn:()=>fetchBookmarks(uid!), enabled:!!uid });

export function useCreateJob() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({
    mutationFn:(d: NewJob & { user_id:string }) => createJob(d),
    onSuccess:()=>{ qc.invalidateQueries({queryKey:["jobs"]}); qc.invalidateQueries({queryKey:["my-jobs"]}); toast({title:"✅ Shaqo lagu daray!",description:"Ogeysiiskaagu hadda waa active.",variant:"success"}); },
    onError:(e:Error)=>toast({title:"Cillad",description:e.message,variant:"destructive"}),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({
    mutationFn:(id:string)=>deleteJob(id),
    onSuccess:()=>{ qc.invalidateQueries({queryKey:["jobs"]}); qc.invalidateQueries({queryKey:["my-jobs"]}); toast({title:"La tirtiray",variant:"success"}); },
    onError:(e:Error)=>toast({title:"Cillad",description:e.message,variant:"destructive"}),
  });
}

export function useReportJob() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({
    mutationFn:({jobId,reporterId,reason,details}:{jobId:string;reporterId:string;reason:string;details?:string})=>reportJob(jobId,reporterId,reason,details),
    onSuccess:()=>{ qc.invalidateQueries({queryKey:["jobs"]}); toast({title:"✅ Waa la soo sheegay",description:"Mahadnaq. Waxaanu baari doonaa.",variant:"success"}); },
    onError:(e:Error)=>toast({title:"Cillad",description:e.message,variant:"destructive"}),
  });
}

export function useToggleBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn:({uid,jobId}:{uid:string;jobId:string})=>toggleBookmark(uid,jobId),
    onSuccess:(_,{uid})=>qc.invalidateQueries({queryKey:["bookmarks",uid]}),
  });
}
