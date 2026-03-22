import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";
import { ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";

type Mode = "login" | "register";

interface Props { open: boolean; onClose: () => void; defaultMode?: Mode; }

export function AuthModal({ open, onClose, defaultMode = "login" }: Props) {
  const [mode,     setMode]     = useState<Mode>(defaultMode);
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [error,    setError]    = useState("");
  const { toast } = useToast();

  const reset = () => { setEmail(""); setPassword(""); setName(""); setError(""); setLoading(false); };
  const close = () => { reset(); onClose(); };
  const sw    = (m: Mode) => { setMode(m); setError(""); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "register") {
        if (name.trim().length < 2) { setError("Magacaaga ku qor (ugu yaraan 2 xaraf)."); return; }
        if (password.length  < 6)   { setError("Furaha waa inuu ahaadaa 6 xaraf oo ka badan."); return; }
        const { error: err } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(), password,
          options: { data: { full_name: name.trim() }, emailRedirectTo: window.location.origin },
        });
        if (err) throw err;
        toast({ title:"✅ Xisaab la furay!", description:"Xaqiiji emailkaaga oo dib u soo gal.", variant:"success" });
        close();
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(), password,
        });
        if (err) {
          if (err.message.includes("Invalid login credentials"))
            throw new Error("Emailka ama furaha sirta ah waa khalad.");
          if (err.message.includes("Email not confirmed"))
            throw new Error("Fadlan xaqiiji emailkaaga ka hor inta aadan galinin.");
          throw err;
        }
        toast({ title:"✅ Soo dhawoow!", variant:"success" });
        close();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Khalad ayaa dhacay. Isku day mar kale.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) close(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold">SB</span>
            </div>
            <DialogTitle className="text-xl font-display">
              {mode === "login" ? "Gal Xisaabta" : "Xisaab Cusub Fur"}
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Gal si aad u daabacdo shaqooyin iyo profile."
              : "Samee xisaab bilaash ah — shaqo daabac ama profile samee."}
          </p>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Magacaaga Buuxa <span className="text-destructive">*</span></Label>
              <Input id="name" placeholder="Magacaaga" value={name} onChange={e => setName(e.target.value)} required autoComplete="name"/>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
            <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"/>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pw">Furaha Sirta Ah <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Input id="pw" type={showPw ? "text" : "password"} placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="pr-10"/>
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/> <span>{error}</span>
            </div>
          )}

          <div className="scam-banner">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600"/>
            <span>SB Somali Business waa bilaash. Xisaab furista lacag uma baahna.</span>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {mode === "login" ? "Gal" : "Fur Xisaab"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>Xisaab ma lihid?{" "}<button type="button" onClick={() => sw("register")} className="text-primary font-semibold hover:underline">Fur haddeer</button></>
            ) : (
              <>Xisaab horay u lahayd?{" "}<button type="button" onClick={() => sw("login")} className="text-primary font-semibold hover:underline">Gal</button></>
            )}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
