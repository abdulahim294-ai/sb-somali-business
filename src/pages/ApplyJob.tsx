import { useState } from "react";
import { useRoute, Link } from "wouter";
import {
  Send,
  Lock,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  Mail,
  Briefcase,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Crown,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth/AuthModal";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { useJob } from "@/hooks/useJobs";
import { useApplyToJob } from "@/hooks/useApplications";
import { useCanApply, usePlan } from "@/hooks/usePlan";

export default function ApplyJob() {
  const [, params] = useRoute<{ id: string }>("/jobs/:id/apply");
  const jobId = params?.id ?? "";

  const { user, profile } = useAuth();
  const { plan } = usePlan();
  const canApply = useCanApply();
  const { data: job, isLoading: jobLoad } = useJob(jobId);
  const { mutate: apply, isPending } = useApplyToJob();

  const [showAuth, setShowAuth] = useState(false);
  const [success, setSuccess] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [whatsapp, setWhatsapp] = useState(profile?.phone ?? "+252");
  const [email, setEmail] = useState(user?.email ?? "");

  // ── Auth gate
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-10 max-w-md w-full text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">
              Soo gal ka hor
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Si aad codsi u diriyo waxaad u baahan tahay xisaab — bilaash.
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

  // ── Plan limit gate
  if (!canApply) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-10 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="font-display text-xl font-bold mb-2">
              Xaddiga ayaad gaadhay
            </h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Qorshaha <strong>{plan.name}</strong> wuxuu kuu oggolahaa{" "}
              <strong>{plan.limits.appsPerMonth} codsi</strong> bil kasta.
            </p>
            <p className="text-muted-foreground mb-6 text-sm">
              Kor u qaad qorshahaaga si aad codsiyo badan u diri karto.
            </p>
            <div className="flex gap-3">
              <Link href="/pricing" className="flex-1">
                <Button className="w-full">Eeg qorshooyinka</Button>
              </Link>
              <Link href="/jobs" className="flex-1">
                <Button variant="outline" className="w-full">Shaqooyinka</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Loading
  if (jobLoad) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // ── Job not found
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">
            Shaqada lama helin
          </h2>
          <p className="text-muted-foreground mb-6">
            Waxaa laga yaabaa in la tirtiray.
          </p>
          <Link href="/jobs">
            <Button>Eeg shaqooyinka</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Success
  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">
              Codsigaaga waa la diray!
            </h2>
            <p className="text-muted-foreground mb-2">
              Daabaciyahu waxa uu heli doonaa codsigaaga oo kuula soo xiriiri
              doona haddii uu xiiseeysto.
            </p>
            <p className="text-sm font-semibold text-slate-700 mb-6">
              Shaqada: {job.title} @ {job.company}
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">Dashboard</Button>
              </Link>
              <Link href="/jobs" className="flex-1">
                <Button className="w-full">Raadi kale</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    apply(
      {
        job_id: job!.id,
        user_id: user!.id,
        cover_letter: coverLetter || null,
        contact_whatsapp: whatsapp || null,
        contact_email: email || null,
      },
      { onSuccess: () => setSuccess(true) }
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container-form">
          <PageHeader
            crumbs={[
              { label: "Shaqooyinka", href: "/jobs" },
              { label: job.title, href: `/jobs/${job.id}` },
              { label: "Codso" },
            ]}
            title="Codso shaqada"
          />

          {/* Job preview card */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                    {job.type}
                  </Badge>
                  {job.is_verified && (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" /> La xaqiijiyay
                    </Badge>
                  )}
                </div>
                <h2 className="font-display font-bold text-lg text-slate-900">
                  {job.title}
                </h2>
                <p className="text-slate-600 font-medium text-sm mt-0.5">
                  {job.company}
                </p>
              </div>
              <Link href={`/jobs/${job.id}`}>
                <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Dib
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary/60" /> {job.location}
              </div>
              {job.salary && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary/60" />{" "}
                  {job.salary}
                </div>
              )}
            </div>
          </div>

          {/* Anti-scam warning */}
          <div className="scam-banner mb-6">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold">Digniin: </span>
              Ha u dirin lacag kasta daabaciyaha. Shaqo dhabtu ma baahidaan
              "registration fee" ama EVC/ZAAD.
            </div>
          </div>

          {/* Application form */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <h3 className="font-display font-bold text-slate-900 mb-5">
              Buuxi foomka codsiga
            </h3>
            <form onSubmit={onSubmit} className="space-y-5">
              <FormField
                label="Warqadda soo bandhigidda (ikhtiyaari)"
                hint="Ku sharax sababta aad u xiiseynaysaa shaqadan iyo khibradaada ku habboon."
              >
                <Textarea
                  placeholder={`Tusaale:\n\nSalaan, magacaygu waa ${profile?.full_name ?? "..."} waxaana xiiseynayaa shaqadaada "${job.title}".\n\nWaxaan leeyahay khibrad [...] ...\n\nMahadnaq.`}
                  className="min-h-[160px]"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </FormField>

              <div className="pt-4 border-t border-border/60">
                <h4 className="font-semibold text-slate-900 mb-1 text-sm">
                  Xog xiriir
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Daabaciyuhu si toos ah ayuu kuula soo xiriiri doonaa.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="WhatsApp" hint="+252...">
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <Input
                        className="pl-10"
                        placeholder="+252 61 ..."
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </div>
                  </FormField>
                  <FormField label="Email">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        className="pl-10"
                        placeholder="adiga@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link href={`/jobs/${job.id}`} className="shrink-0">
                  <Button type="button" variant="outline" className="gap-1.5">
                    <ArrowLeft className="w-4 h-4" /> Dib
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 h-12 text-base font-semibold gap-2"
                  loading={isPending}
                  disabled={!whatsapp && !email}
                >
                  <Send className="w-4 h-4" /> Dir codsiga
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Codsiga, macluumaadkaaga si aamin ah ayaa daabaciyaha loo
                gudbinayaa. Weligaa ha lacag bixin.
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
