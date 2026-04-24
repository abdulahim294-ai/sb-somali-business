import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { supabase, SUPABASE_CONFIGURED } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";

type Mode = "login" | "register";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultMode?: Mode;
}

export function AuthModal({ open, onClose, defaultMode = "login" }: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const reset = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setLoading(false);
  };
  const close = () => {
    reset();
    onClose();
  };
  const sw = (m: Mode) => {
    setMode(m);
    setError("");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!SUPABASE_CONFIGURED) {
      setError(
        "Adeegga ma diyaarsana hadda. Fadlan dib u eeg muddo yar dabadeed."
      );
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        if (name.trim().length < 2) {
          setError("Magacaaga geli (ugu yaraan 2 xaraf).");
          return;
        }
        if (password.length < 6) {
          setError("Furaha sirta ah waa inuu noqdaa ugu yaraan 6 xaraf.");
          return;
        }
        const { error: err } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (err) throw err;
        toast({
          title: "Xisaab waa la furay!",
          description: "Xaqiiji emailkaaga ka dibna soo gal.",
          variant: "success",
        });
        close();
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (err) {
          if (err.message.includes("Invalid login credentials"))
            throw new Error("Emailka ama furaha sirta ah waa khalad.");
          if (err.message.includes("Email not confirmed"))
            throw new Error(
              "Fadlan xaqiiji emailkaaga ka hor inta aanad gelin."
            );
          throw err;
        }
        toast({ title: "Soo dhawoow!", variant: "success" });
        close();
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Khalad ayaa dhacay. Mar kale isku day."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) close();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
              <span className="text-white font-bold">SB</span>
            </div>
            <DialogTitle className="text-xl font-display">
              {mode === "login" ? "Soo gal xisaabta" : "Samee xisaab cusub"}
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Soo gal si aad u daabacdo shaqooyin ama profile-kaaga u sameyso."
              : "Samee xisaab bilaash ah — daabac shaqo ama samee profile."}
          </p>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Magacaaga buuxa <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Tusaale: Aaden Maxamed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pw">
              Furaha sirta ah <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="pw"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPw ? "Qari furaha" : "Tus furaha"}
                tabIndex={-1}
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {mode === "register" && (
              <p className="text-[11px] text-muted-foreground">
                Ugu yaraan 6 xaraf.
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="scam-banner">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              SB Somali Business waa bilaash. Lacag laguma weydiisto markaad
              xisaab furayso.
            </span>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {mode === "login" ? "Soo gal" : "Samee xisaab"}
          </Button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ama</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <GoogleButton />

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Xisaab ma lihid?{" "}
                <button
                  type="button"
                  onClick={() => sw("register")}
                  className="text-primary font-semibold hover:underline"
                >
                  Hadda samee
                </button>
              </>
            ) : (
              <>
                Xisaab horay u haysatay?{" "}
                <button
                  type="button"
                  onClick={() => sw("login")}
                  className="text-primary font-semibold hover:underline"
                >
                  Soo gal
                </button>
              </>
            )}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
