import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField, Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useCreateFreelancer } from "@/hooks/useFreelancers";
import { sanitize } from "@/utils/spamFilter";
import { LOCATIONS } from "@/utils/helpers";
import { CheckCircle2, Lock, X, Plus, ShieldCheck, MessageSquare } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Geli magacaaga buuxa").max(80),
  role: z.string().min(2, "Geli xirfaddaada").max(80),
  location: z.string().min(2, "Dooro degaanka").max(80),
  bio: z.string().max(500).optional(),
  contact_whatsapp: z.string().min(6, "Geli lambar WhatsApp ah"),
  contact_email: z
    .string()
    .email("Geli email sax ah")
    .optional()
    .or(z.literal("")),
  portfolio_url: z
    .string()
    .url("Geli URL sax ah (https://...)")
    .optional()
    .or(z.literal("")),
});
type FV = z.infer<typeof schema>;

export default function CreateProfile() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { mutate, isPending } = useCreateFreelancer();
  const [showAuth, setShowAuth] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillIn, setSkillIn] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FV>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      role: "",
      location: "Mogadishu",
      bio: "",
      contact_whatsapp: "+252",
      contact_email: "",
      portfolio_url: "",
    },
  });

  function addSkill() {
    const s = skillIn.trim();
    if (s && !skills.includes(s) && skills.length < 8) {
      setSkills([...skills, s]);
      setSkillIn("");
    }
  }

  function onSubmit(v: FV) {
    mutate(
      {
        name: sanitize(v.name),
        role: sanitize(v.role),
        location: sanitize(v.location),
        bio: v.bio ? sanitize(v.bio) : null,
        contact_whatsapp: v.contact_whatsapp,
        contact_email: v.contact_email || null,
        portfolio_url: v.portfolio_url || null,
        skills: skills.length ? skills : null,
        rating: "5.0",
        is_verified: false,
        is_available: true,
        user_id: user?.id,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          reset();
          setSkills([]);
        },
      }
    );
  }

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
              Si aad u sameyso profile xirfadle ah, waxaad u baahan tahay
              xisaab — bilaash.
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
              Profile-kaaga waa la sameeyay!
            </h2>
            <p className="text-muted-foreground mb-8">
              Macluumaadkaagu hadda waa muuqdaa ganacsatada.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/freelancers")}
              >
                Eeg xirfadlayaasha
              </Button>
              <Button className="flex-1" onClick={() => navigate("/")}>
                Bogga hore
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10 md:py-12">
        <div className="container-form">
          <div className="scam-banner mb-6">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">Talo: </span>
              Buuxi macluumaadkaaga si run ah. Profile sax ah ayaa keenaya
              shaqo dheeraad ah.
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                Samee profile xirfadle
              </h1>
              <p className="text-muted-foreground mt-1">
                Ku muuqo ganacsatada — bilaash ah.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Magacaaga buuxa"
                  required
                  error={errors.name?.message}
                >
                  <Input
                    placeholder="tusaale: Aaden Maxamed"
                    {...register("name")}
                  />
                </FormField>
                <FormField
                  label="Xirfaddaada"
                  required
                  error={errors.role?.message}
                  hint="Maxaad qabataa? (tusaale: Naqshad, Code, Suuq)"
                >
                  <Input
                    placeholder="tusaale: Web Developer"
                    {...register("role")}
                  />
                </FormField>
              </div>

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
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Naftaada ku sharax (ikhtiyaari)"
                error={errors.bio?.message}
                hint="Sheeg khibradaada, dadka aad u shaqaysay, iyo waxa aad ugu fiican tahay."
              >
                <Textarea
                  placeholder="Tusaale: Waxaan ahay xirfadle khibrad u leh naqshadaynta web-ka iyo brand-ka. 5 sano oo waayo-aragnimo ah..."
                  className="min-h-[110px]"
                  {...register("bio")}
                />
              </FormField>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Xirfadaha (ugu badan 8)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="tusaale: Photoshop"
                    value={skillIn}
                    onChange={(e) => setSkillIn(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className="flex-1"
                    disabled={skills.length >= 8}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSkill}
                    className="gap-1 shrink-0"
                    disabled={skills.length >= 8}
                  >
                    <Plus className="w-4 h-4" /> Ku dar
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() =>
                            setSkills(skills.filter((x) => x !== s))
                          }
                          className="hover:text-red-500 ml-0.5"
                          aria-label={`Tirtir ${s}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {skills.length}/8 xirfadood
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Xog xiriir
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Ganacsatadu si toos ah ayey kuula soo xiriiri doonaan.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    label="WhatsApp"
                    required
                    error={errors.contact_whatsapp?.message}
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
                      placeholder="adigu@email.com"
                      {...register("contact_email")}
                    />
                  </FormField>
                </div>
                <div className="mt-5">
                  <FormField
                    label="Portfolio URL (ikhtiyaari)"
                    error={errors.portfolio_url?.message}
                    hint="Linkiga shaqadaada hore — website, Behance, GitHub, iwm."
                  >
                    <Input
                      placeholder="https://example.com"
                      {...register("portfolio_url")}
                    />
                  </FormField>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                loading={isPending}
              >
                Hadda samee profile
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
