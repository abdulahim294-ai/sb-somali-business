import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useCreateJob } from "@/hooks/useJobs";
import { filterJobPost, isHoneypotFilled, canPostNow, isRateLimited, getFilterMessage, sanitize } from "@/utils/spamFilter";
import { LOCATIONS, JOB_TYPES } from "@/utils/helpers";
import { ShieldCheck, AlertTriangle, Clock, Lock, CheckCircle2, MessageSquare } from "lucide-react";

const schema = z.object({
  title:            z.string().min(3,"Cinwaanka waa inuu ahaadaa 3 xaraf oo ka badan").max(120),
  company:          z.string().min(2,"Magaca shirkadda ku qor").max(100),
  location:         z.string().min(2,"Degaanka dooro ama ku qor"),
  type:             z.string().min(1,"Nooca shaqada dooro"),
  salary:           z.string().max(80).optional(),
  description:      z.string().min(30,"Faahfaahinta waa inay ahaataa 30 xaraf oo ka badan").max(5000),
  contact_whatsapp: z.string().optional(),
  contact_email:    z.string().email("Email sax ah").optional().or(z.literal("")),
});
type FV = z.infer<typeof schema>;

export default function PostJob() {
  const [, navigate]      = useLocation();
  const { user, profile } = useAuth();
  const { mutate, isPending } = useCreateJob();
  const [showAuth, setShowAuth] = useState(false);
  const [spamErr,  setSpamErr]  = useState("");
  const [success,  setSuccess]  = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState:{ errors }, setValue, watch } = useForm<FV>({
    resolver: zodResolver(schema),
    defaultValues: { title:"", company:"", location:"Mogadishu", type:"Full-time", salary:"", description:"", contact_whatsapp:"+252", contact_email:"" },
  });

  // ── Gate: Auth ─────────────────────────────────────────────
  if (!user) return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body"><Header/>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full text-center">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4"/>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Gal Ka Hor</h2>
          <p className="text-muted-foreground mb-6 text-sm">Si aad shaqo u daabacdo waxaad u baahan tahay xisaab — bilaash.</p>
          <Button onClick={() => setShowAuth(true)} className="w-full" size="lg">Gal / Xisaab Fur</Button>
        </div>
      </main>
      <Footer/>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} defaultMode="register"/>
    </div>
  );

  // ── Gate: 24-hour delay ─────────────────────────────────────
  if (profile) {
    const delay = canPostNow(profile.created_at);
    if (!delay.allowed) return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-body"><Header/>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full text-center">
            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4"/>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Sug Yar</h2>
            <p className="text-muted-foreground text-sm mb-5">Isticmaalayaasha cusub waa inay sugaan 24 saacadood. Tani waxay ka ilaalinaysaa khayaanta.</p>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-amber-800 font-bold text-xl">
              ⏱ {delay.hoursLeft} saacadood baad sugaysaa
            </div>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }

  // ── Gate: Rate limit (3/day) ────────────────────────────────
  if (profile && isRateLimited(profile.posts_today, profile.last_post_date)) return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body"><Header/>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4"/>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Xaddiga Gaadhay</h2>
          <p className="text-muted-foreground text-sm">Maalin kasta waad ku daabaci kartaa ugu badan 3 shaqo. Berri isku day.</p>
        </div>
      </main>
      <Footer/>
    </div>
  );

  // ── Success ─────────────────────────────────────────────────
  if (success) return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body"><Header/>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4"/>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">✅ Shaqada Waa La Daabacay!</h2>
          <p className="text-muted-foreground mb-8">Ogeysiiskaagu hadda waa active. Shaqaalaha ayaa arki doona.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/jobs")}>Shaqooyinka</Button>
            <Button className="flex-1" onClick={() => setSuccess(false)}>Mid Kale</Button>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );

  function onSubmit(values: FV) {
    setSpamErr("");
    // Layer 2: Honeypot
    if (isHoneypotFilled(honeypot.current?.value ?? "")) { setSpamErr("Codsigaan waa la diidey (bot la helay)."); return; }
    // Layer 1: Spam filter
    const fr = filterJobPost({ title:sanitize(values.title), description:sanitize(values.description), company:sanitize(values.company) });
    if (!fr.passed) { setSpamErr(getFilterMessage(fr)); return; }

    mutate(
      { title:sanitize(values.title), company:sanitize(values.company), location:values.location,
        type:values.type, salary:values.salary ? sanitize(values.salary) : null,
        description:sanitize(values.description),
        contact_whatsapp:values.contact_whatsapp ?? null, contact_email:values.contact_email ?? null,
        user_id:user.id },
      { onSuccess: () => setSuccess(true) }
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Header/>
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Anti-scam warning */}
          <div className="scam-banner mb-6">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0"/>
            <div className="text-sm"><span className="font-semibold">Muhiim: </span>
              Ha codsanin lacag shaqaalaha. Shaqo dhabtu ma baahidaan EVC, ZAAD, ama registration fee. Ogeysiisyada khayaanada ah si toos ah ayaa loo tirtirayaa.
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold text-slate-900">Shaqo Cusub Daabac</h1>
              <p className="text-muted-foreground mt-1">Gaaro shaqaalaha maanta. Bilaash.</p>
              {profile && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold font-display text-sm">{profile.trust_score}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Trust Score: {profile.trust_score}/100</p>
                    <p className="text-xs text-muted-foreground">+10 dhibco mar walba oo aad shaqo daabacdo</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot — hidden from humans */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} ref={honeypot} autoComplete="off"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Cinwaanka Shaqada" required error={errors.title?.message}>
                  <Input placeholder="tusaale: Sales Manager" {...register("title")}/>
                </FormField>
                <FormField label="Magaca Shirkadda" required error={errors.company?.message}>
                  <Input placeholder="tusaale: Hormuud Telecom" {...register("company")}/>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Degaanka" required error={errors.location?.message}>
                  <Select defaultValue="Mogadishu" onValueChange={v => setValue("location", v)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      <SelectItem value="other">Meel Kale</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Nooca Shaqada" required error={errors.type?.message}>
                  <Select defaultValue="Full-time" onValueChange={v => setValue("type", v)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField label="Mushaharka (ikhtiyaari)" error={errors.salary?.message}>
                <Input placeholder="tusaale: $500 – $800/bilood" {...register("salary")}/>
              </FormField>

              <FormField label="Faahfaahinta Shaqada" required error={errors.description?.message}
                hint="Sharax shaqada, shuruudaha, iyo faa'iidooyinka. Ugu yaraan 30 xaraf.">
                <Textarea placeholder="Describe the role clearly..." className="min-h-[160px]" {...register("description")}/>
              </FormField>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-slate-900 mb-1">Xiriirka</h3>
                <p className="text-xs text-muted-foreground mb-4">Shaqaalaha kula soo xiriiri doona toos.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="WhatsApp" error={errors.contact_whatsapp?.message}>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"/>
                      <Input className="pl-9" placeholder="+252698..." {...register("contact_whatsapp")}/>
                    </div>
                  </FormField>
                  <FormField label="Email (ikhtiyaari)" error={errors.contact_email?.message}>
                    <Input type="email" placeholder="hr@shirkad.com" {...register("contact_email")}/>
                  </FormField>
                </div>
              </div>

              {spamErr && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600"/> <span>{spamErr}</span>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-base" loading={isPending}>
                Shaqada Daabac Haddeer
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Daabicidda, waxaad ogolaanaysaa Terms of Service-ka. Ha u dirin lacag shaqaalaha.
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
