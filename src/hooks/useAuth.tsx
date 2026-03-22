import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, type Profile } from "@/lib/supabase";

interface AuthCtx { user: User|null; profile: Profile|null; loading: boolean; refresh: ()=>Promise<void>; }
const Ctx = createContext<AuthCtx>({ user:null, profile:null, loading:true, refresh:async()=>{} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User|null>(null);
  const [profile, setProfile] = useState<Profile|null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data as Profile|null);
  }, []);

  const refresh = useCallback(async () => { if (user) await loadProfile(user.id); }, [user, loadProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id); else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, [loadProfile]);

  return <Ctx.Provider value={{ user, profile, loading, refresh }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
