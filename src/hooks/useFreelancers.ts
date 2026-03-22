import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type Freelancer, type NewFreelancer } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

async function fetchFreelancers(f: { search?: string; location?: string }) {
  let q = supabase.from("freelancers").select("*").order("joined_at", { ascending: false });
  if (f.search?.trim()) { const s = f.search.trim(); q = q.or(`name.ilike.%${s}%,role.ilike.%${s}%`); }
  if (f.location && f.location !== "all") q = q.ilike("location", `%${f.location}%`);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as Freelancer[];
}

async function createFreelancer(input: NewFreelancer & { user_id?: string }) {
  const { data, error } = await supabase.from("freelancers").insert([input]).select().single();
  if (error) throw new Error(error.message);
  return data as Freelancer;
}

export const useFreelancers = (f: { search?: string; location?: string } = {}) =>
  useQuery({ queryKey:["freelancers",f], queryFn:()=>fetchFreelancers(f), staleTime:30_000 });

export function useCreateFreelancer() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({
    mutationFn:(d: NewFreelancer & { user_id?: string }) => createFreelancer(d),
    onSuccess:()=>{ qc.invalidateQueries({queryKey:["freelancers"]}); toast({title:"✅ Profile la sameeyay!",description:"Macluumaadkaagu hadda waa muuqanayaa.",variant:"success"}); },
    onError:(e:Error)=>toast({title:"Cillad",description:e.message,variant:"destructive"}),
  });
}
