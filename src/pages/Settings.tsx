import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User, Phone, MapPin, Globe, FileText, CheckCircle2,
  Lock, Settings as SettingsIcon, ArrowRight, Shield, Mail,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

const schema = z.object({
  full_name: z.string().min(2, "Geli magacaaga buuxa").max(80),
  phone: z.string().max(20).optional().or(z.literal("")),
  city: z.string().max(80).optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
  website_url: z
    .string()
    .url("Geli URL sax ah (https://...)")
    .optional()
    .or(z.literal("")),
});

type FV = z.infer<typeof schema>;

export default function Settings() {
  const { user, profile, refresh } = useAuth();
  const { toast } = useToast();
  const [showAuth, setShowAuth] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FV>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      phone: "",
      city: "",
      bio: "",
      website_url: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        bio: profile.bio ?? "",
        website_url: profile.website_url ?? "",
      });
    }
  }, [profile, reset]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-10 max-w-md w-full text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Soo gal ka hor</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Si aad profile-kaaga u beddesho waxaad u baahan tahay xisaab.
            </p>
            <Button onClick={() => setShowAuth(true)} className="w-full" size="lg">
              Soo gal / Samee xisaab
            </Button>
          </div>
        </main>
        <Footer />
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} defaultMode="login" />
      </div>
    );
  }

  async function onSubmit(v: FV) {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: v.full_name.trim(),
        phone: v.phone?.trim() || null,
        city: v.city?.trim() || null,
        bio: v.bio?.trim() || null,
        website_url: v.website_url?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Khalad", description: error.message, variant: "destructive" });
      return;
    }
    await refresh();
    setSaved(true);
    toast({ title: "Profile waa la cusbooneysiiyay ✓", variant: "success" });
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container-form">
          <PageHeader
            crumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Goobta" },
            ]}
            title="Goobta xisaabta"
            subtitle="Cusbooneysi macluumaadkaaga shakhsiga."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
                <h2 className="font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Macluumaadka shakhsiga
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <FormField label="Magac buux" required error={errors.full_name?.message}>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="Magacaaga buuxa"
                        {...register("full_name")}
                      />
                    </div>
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="WhatsApp / Taleefon"
                      error={errors.phone?.message}
                      hint="+252 61 ..."
                    >
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        <Input
                          className="pl-10"
                          placeholder="+252 61 ..."
                          {...register("phone")}
                        />
                      </div>
                    </FormField>
                    <FormField
                      label="Magaalo / Degaan"
                      error={errors.city?.message}
                    >
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          placeholder="Mogadishu, Hargeisa..."
                          {...register("city")}
                        />
                      </div>
                    </FormField>
                  </div>

                  <FormField
                    label="Faahfaahin naftaada (Bio)"
                    error={errors.bio?.message}
                    hint="Ugu badan 500 xaraf. Ku sharax khibradaada iyo xirfadahaaga."
                  >
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                      <Textarea
                        className="pl-10 min-h-[120px]"
                        placeholder="Waxaan ahay xirfadle leh khibrad..."
                        {...register("bio")}
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Website / Portfolio URL"
                    error={errors.website_url?.message}
                    hint="Tusaale: https://myportfolio.com"
                  >
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="https://"
                        {...register("website_url")}
                      />
                    </div>
                  </FormField>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold gap-2"
                    disabled={saving}
                  >
                    {saved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> La keydsaday!
                      </>
                    ) : saving ? (
                      "Keydsanaya..."
                    ) : (
                      <>
                        <SettingsIcon className="w-4 h-4" /> Keydi isbedelada
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Account info card */}
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Xisaabta
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-slate-600 truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary/60" /> Trust Score
                    </span>
                    <span className="font-bold text-primary">
                      {profile?.trust_score ?? 20}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Xaqiijiyay</span>
                    <span
                      className={
                        profile?.is_verified
                          ? "text-emerald-600 font-semibold"
                          : "text-slate-400"
                      }
                    >
                      {profile?.is_verified ? "Haa ✓" : "Maya"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick nav */}
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Xiriirinta degdeg
                </p>
                <div className="space-y-1">
                  {[
                    { href: "/dashboard", label: "Dashboard" },
                    { href: "/create-profile", label: "Profile xirfadle" },
                    { href: `/cv/${user.id}`, label: "Eeg CV-gaaga" },
                    { href: "/pricing", label: "Kor u qaad qorshaha" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href}>
                      <div className="flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-sm text-slate-700 hover:text-primary group">
                        {l.label}
                        <ArrowRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="bg-primary/5 rounded-2xl border border-primary/15 p-5 text-sm">
                <p className="font-semibold text-primary mb-1">💡 Talooyin</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Profile buuxa leh bio, taleefon, iyo xirfadaha ayaa 3x
                  badan daawashada ka helaya. Dhamaystir macluumaadkaaga
                  si aad trust score-kaaga u kor u qaaddo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
