import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField } from "@/components/ui/input";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useCreateFreelancer } from "@/hooks/useFreelancers";
import { sanitize } from "@/utils/spamFilter";
import { CheckCircle2, Lock, X, Plus } from "lucide-react";

const schema = z.object({
  name:             z.string().min(2,"Magacaaga ku qor").max(80),
  role:             z.string().min(2,"Xirfadaada ku qor").max(80),
  location:         z.string().min(2,"Degaanka ku qor").max(80),
  bio:              z.string().max(500).optional(),
  contact_whatsapp: z.string().min(6,"WhatsApp number ku qor"),
  contact_email:    z.string().email("Email sax ah").optional().or(z.literal("")),
  portfolio_url:    z.string().url("URL sax ah").optional().or(z.literal("")),
});
type FV = z.infer<typeof schema>;

export default function CreateProfile() {
  const [, navigate]  = useLocation();
  const { user }      = useAuth();
  const { mutate, isPending } = useCreateFreelancer();
  const [showAuth, setShowAuth] = useState(false);
  const [skills, setSkills]     = useState<string[]>([]);
  const [skillIn, setSkillIn]   = useState("");
  const [success, setSuccess]   = useState(false);

  const { register, handleSubmit, formState:{ errors } } = useForm<FV>({
    resolver: zodResolver(schema),
    defaultValues: { name:"", role:"", location:"Mogadishu", bio:"", contact_whatsapp:"+252", contact_email:"", portfolio_url:"" },
  });

  function addSkill() {
    const s = skillIn.trim();
    if (s && !skills.includes(s) && skills.length < 8) { setSkills([...skills, s]); setSkillIn(""); }
  }

  function onSubmit(v: FV) {
    mutate({
      name:sanitize(v.name), role:sanitize(v.role), location:sanitize(v.location),
      bio:v.bio ? sanitize(v.bio) : null,
      contact_whatsapp:v.contact_whatsapp, contact_email:v.contact_email||null,
      portfolio_url:v.portfolio_url||null,
      skills:skills.length ? skills : null, rating:"5.0", is_verified:false, is_available:true,
      user_id:user?.id,
    },{ onSuccess: () => setSuccess(true) });
  }

  if (!user) return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body"><Header/>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full text-center">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4"/>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Gal Ka Hor</h2>
          <p className="text-muted-foreground mb-6 text-sm">Si aad profile u samayso waxaad u baahan tahay xisaab — bilaash.</p>
          <Button onClick={() => setShowAuth(true)} className="w-full" size="lg">Gal / Xisaab Fur</Button>
        </div>
      </main>
      <Footer/>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} defaultMode="register"/>
    </div>
  );

  if (success) return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body"><Header/>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4"/>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">✅ Profile La Sameeyay!</h2>
          <p className="text-muted-foreground mb-8">Macluumaadkaagu hadda waa muuqanayaa ganacsatada.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/freelancers")}>Xirfadlayaasha</Button>
            <Button className="flex-1" onClick={() => navigate("/")}>Bogga Hore</Button>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Header/>
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold text-slate-900">Profile Xirfad Samee</h1>
              <p className="text-muted-foreground mt-1">Ku muuqo ganacsatada. Bilaash.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Magacaaga Buuxa" required error={errors.name?.message}>
                  <Input placeholder="Magacaaga" {...register("name")}/>
                </FormField>
                <FormField label="Xirfadaada" required error={errors.role?.message}>
                  <Input placeholder="tusaale: Web Developer" {...register("role")}/>
                </FormField>
              </div>

              <FormField label="Degaanka" required error={errors.location?.message}>
                <Input placeholder="tusaale: Mogadishu" {...register("location")}/>
              </FormField>

              <FormField label="Naftaada Ku Sharrax (ikhtiyaari)" error={errors.bio?.message}>
                <Textarea placeholder="Khibradaada, waxa aad ugu wanaagsan tahay..." className="min-h-[100px]" {...register("bio")}/>
              </FormField>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Xirfadaha (ugu badan 8)</label>
                <div className="flex gap-2">
                  <Input placeholder="tusaale: Photoshop" value={skillIn}
                    onChange={e => setSkillIn(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); }}}
                    className="flex-1"/>
                  <Button type="button" variant="outline" size="sm" onClick={addSkill} className="gap-1">
                    <Plus className="w-4 h-4"/> Kudar
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map(s => (
                      <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {s}
                        <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))} className="hover:text-red-500 ml-0.5">
                          <X className="w-3 h-3"/>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-slate-900 mb-4">Xiriirka</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="WhatsApp" required error={errors.contact_whatsapp?.message}>
                    <Input placeholder="+252698..." {...register("contact_whatsapp")}/>
                  </FormField>
                  <FormField label="Email (ikhtiyaari)" error={errors.contact_email?.message}>
                    <Input type="email" placeholder="you@email.com" {...register("contact_email")}/>
                  </FormField>
                </div>
                <div className="mt-4">
                  <FormField label="Portfolio URL (ikhtiyaari)" error={errors.portfolio_url?.message}>
                    <Input placeholder="https://yourportfolio.com" {...register("portfolio_url")}/>
                  </FormField>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base" loading={isPending}>
                Profile Sameey Haddeer
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
