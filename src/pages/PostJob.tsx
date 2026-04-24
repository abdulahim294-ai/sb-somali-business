import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useCreateJob } from "@/hooks/useJobs";
import {
  filterJobPost,
  isHoneypotFilled,
  canPostNow,
  isRateLimited,
  getFilterMessage,
  sanitize,
} from "@/utils/spamFilter";
import { LOCATIONS, JOB_TYPES } from "@/utils/helpers";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Lock,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

const schema = z.object({
  title: z
    .string()
    .min(3, "Cinwaanka waa inuu noqdaa ugu yaraan 3 xaraf")
    .max(120, "Cinwaanka waa inuu ka yar yahay 120 xaraf"),
  company: z.string().min(2, "Geli magaca shirkadda").max(100),
  location: z.string().min(2, "Dooro degaanka"),
  type: z.string().min(1, "Dooro nooca shaqada"),
  salary: z.string().max(80).optional(),
  description: z
    .string()
    .min(30, "Faahfaahinta waa inay noqotaa ugu yaraan 30 xaraf")
    .max(5000),
  contact_whatsapp: z.string().optional(),
  contact_email: z
    .string()
    .email("Geli email sax ah")
    .optional()
    .or(z.literal("")),
});
type FV = z.infer<typeof schema>;

export default function PostJob() {
  const [, navigate] = useLocation();
  const { user, profile } = useAuth();
  const { mutate, isPending } = useCreateJob();
  const [showAuth, setShowAuth] = useState(false);
  const [spamErr, setSpamErr] = useState("");
  const [success, setSuccess] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FV>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      company: "",
      location: "Mogadishu",
      type: "Full-time",
      salary: "",
      description: "",
      contact_whatsapp: "+252",
      contact_email: "",
    },
  });

  // ── Gate: Auth ─────────────────────────────────────────────
  if (!user)
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
              Soo gal ka hor
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Si aad shaqo u daabacdo, waxaad u baahan tahay xisaab — bilaash.
            </p>
            <Button
              onClick={() => setShowAuth(true)}
              className="w-full"
              size="lg"
            >
              Soo gal / Samee xisaab
            </Button>
          </div>
        </main>
        <Footer />
        <AuthModal
          open={showAuth}
          onClose={() => setShowAuth(false)}
          defaultMode="register"
        />
      </div>
    );

  // ── Gate: 24-hour delay ─────────────────────────────────────
  if (profile) {
    const delay = canPostNow(profile.created_at);
    if (!delay.allowed)
      return (
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-md border border-border/60 p-8 max-w-md w-full text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
                Sug in yar
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Isticmaalayaasha cusub waa inay sugaan 24 saac. Tani waxay
                naga caawinaysaa inaynu kala saarno khayaanada.
              </p>
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-amber-900 font-bold text-xl">
                ⏱ {delay.hoursLeft} saac ayaad sugaysaa
              </div>
            </div>
          </main>
          <Footer />
        </div>
      );
  }

  // ── Gate: Rate limit (3/day) ────────────────────────────────
  if (profile && isRateLimited(profile.posts_today, profile.last_post_date))
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
              Xaddiga ayaad gaadhay
            </h2>
            <p className="text-muted-foreground text-sm">
              Maalintii waxaad daabici kartaa ugu badnaan 3 shaqo. Berri isku
              day mar dambe.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );

  // ── Success ─────────────────────────────────────────────────
  if (success)
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
              Shaqada waa la daabacay!
            </h2>
            <p className="text-muted-foreground mb-8">
              Xayeysiiskaagu hadda waa firfircoon. Shaqo raadiyayaashu ayaa arki
              doona.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/jobs")}
              >
                Eeg shaqooyinka
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setSuccess(false);
                  reset();
                }}
              >
                Daabac mid kale
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );

  function onSubmit(values: FV) {
    setSpamErr("");
    if (isHoneypotFilled(honeypot.current?.value ?? "")) {
      setSpamErr("Codsigaaga waa la diiday (bot ayaa la helay).");
      return;
    }
    const fr = filterJobPost({
      title: sanitize(values.title),
      description: sanitize(values.description),
      company: sanitize(values.company),
    });
    if (!fr.passed) {
      setSpamErr(getFilterMessage(fr));
      return;
    }

    mutate(
      {
        title: sanitize(values.title),
        company: sanitize(values.company),
        location: values.location,
        type: values.type,
        salary: values.salary ? sanitize(values.salary) : null,
        description: sanitize(values.description),
        contact_whatsapp: values.contact_whatsapp ?? null,
        contact_email: values.contact_email || null,
        user_id: user!.id,
      },
      { onSuccess: () => setSuccess(true) }
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10 md:py-12">
        <div className="container-form">
          <div className="scam-banner mb-6">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">Muhiim: </span>
              Ha codsanin lacag shaqo raadiyayaasha. Shaqo dhabtu ma baahidaan
              EVC, ZAAD, ama 'registration fee'. Xayeysiisyada khayaano ah si
              toos ah ayaa loo tirtiri doonaa.
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                Daabac shaqo cusub
              </h1>
              <p className="text-muted-foreground mt-1">
                Gaar shaqo raadiyayaasha maanta — bilaash ah.
              </p>
              {profile && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/15">
                  <div className="w-11 h-11 bg-primary/15 rounded-full flex items-center justify-center text-primary font-bold font-display">
                    {profile.trust_score}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Trust Score: {profile.trust_score}/100
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +10 dhibco ayaad heli markasta oo aad shaqo daabacdid.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  ref={honeypot}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Cinwaanka shaqada"
                  required
                  error={errors.title?.message}
                >
                  <Input
                    placeholder="tusaale: Sales Manager"
                    {...register("title")}
                  />
                </FormField>
                <FormField
                  label="Magaca shirkadda"
                  required
                  error={errors.company?.message}
                >
                  <Input
                    placeholder="tusaale: Hormuud Telecom"
                    {...register("company")}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Degaanka"
                  required
                  error={errors.location?.message}
                >
                  <Select
                    defaultValue="Mogadishu"
                    onValueChange={(v) => setValue("location", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Meel kale</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField
                  label="Nooca shaqada"
                  required
                  error={errors.type?.message}
                >
                  <Select
                    defaultValue="Full-time"
                    onValueChange={(v) => setValue("type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <FormField
                label="Mushaharka (ikhtiyaari)"
                error={errors.salary?.message}
                hint="Tus shaqo raadiyaha qiyaas mushahar ah si ay isugu maanta dharreemo."
              >
                <Input
                  placeholder="tusaale: $500 – $800 / bilkii"
                  {...register("salary")}
                />
              </FormField>

              <FormField
                label="Faahfaahinta shaqada"
                required
                error={errors.description?.message}
                hint="Si cad ku sharax shaqada, shuruudaha, iyo faa'iidooyinka. Ugu yaraan 30 xaraf."
              >
                <Textarea
                  placeholder="Sharax shaqada, masuuliyadaha, khibradda loo baahan yahay, iyo faa'iidooyinka..."
                  className="min-h-[160px]"
                  {...register("description")}
                />
              </FormField>

              <div className="pt-4 border-t border-border/60">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Xog xiriir
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Shaqo raadiyayaashu si toos ah ayey kuula soo xiriiri doonaan.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    label="WhatsApp"
                    error={errors.contact_whatsapp?.message}
                    hint="Tusaale: +252 61 234 5678"
                  >
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <Input
                        className="pl-10"
                        placeholder="+252 61 ..."
                        {...register("contact_whatsapp")}
                      />
                    </div>
                  </FormField>
                  <FormField
                    label="Email (ikhtiyaari)"
                    error={errors.contact_email?.message}
                  >
                    <Input
                      type="email"
                      placeholder="hr@shirkad.com"
                      {...register("contact_email")}
                    />
                  </FormField>
                </div>
              </div>

              {spamErr && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                  <span>{spamErr}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                loading={isPending}
              >
                Daabac shaqada hadda
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Markaad daabacdo, waxaad ogolaanaysaa shuruudaha adeegga. Ha u
                dirin lacag shaqo raadiyaha.
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
