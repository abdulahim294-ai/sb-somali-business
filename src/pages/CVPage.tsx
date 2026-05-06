import { useRoute, Link } from "wouter";
import {
  MapPin, Star, BadgeCheck, MessageSquare, Globe, Mail, Shield,
  Briefcase, Calendar, Printer, ArrowLeft, ExternalLink, AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlanBadge } from "@/components/PlanBadge";
import { supabase, type Profile as TProfile, type Freelancer } from "@/lib/supabase";
import { getPlan } from "@/lib/plans";
import { getTrustInfo } from "@/utils/trustScore";
import { fmtDate } from "@/utils/helpers";

async function fetchCVData(id: string) {
  const [{ data: profile }, { data: freelancers }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.from("freelancers").select("*").eq("user_id", id),
  ]);
  return {
    profile: profile as TProfile | null,
    freelancer: (freelancers?.[0] as Freelancer | null) ?? null,
  };
}

export default function CVPage() {
  const [, params] = useRoute<{ id: string }>("/cv/:id");
  const userId = params?.id ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["cv-data", userId],
    queryFn: () => fetchCVData(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  if (isLoading) {
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

  const profile = data?.profile;
  const freelancer = data?.freelancer;

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">CV lama helin</h2>
          <p className="text-muted-foreground mb-6">
            Isticmaaluhu ma jiro ama weli profile lama sameysan.
          </p>
          <Link href="/freelancers">
            <Button>Eeg xirfadlayaasha</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : profile.email?.[0]?.toUpperCase() ?? "U";

  const trust = getTrustInfo(profile.trust_score);
  const plan = getPlan(profile.plan);

  const contactPhone = freelancer?.contact_whatsapp ?? profile.phone;
  const waLink = contactPhone
    ? `https://wa.me/${contactPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Salaan! CV-gaaga sb-somali-business ayaan ka arkay. Shaqo ayaan kula hadli raba.`
      )}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8 md:py-12 print:py-0">
        <div className="container-app max-w-3xl">
          {/* Action bar — hidden when printing */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3 print:hidden">
            <Link href={`/profile/${userId}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Profile
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigator.clipboard.writeText(window.location.href).then(() => {})}
                className="gap-1.5"
              >
                Koobiyee xiriirka
              </Button>
              <Button size="sm" onClick={() => window.print()} className="gap-2">
                <Printer className="w-4 h-4" /> Daabac / PDF
              </Button>
            </div>
          </div>

          {/* ── CV Document ───────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-md overflow-hidden print:shadow-none print:border-none print:rounded-none">

            {/* Header gradient band */}
            <div className="bg-gradient-to-br from-primary via-primary to-primary/80 p-8 text-white">
              <div className="flex items-start gap-6 flex-wrap">
                <Avatar className="w-20 h-20 border-4 border-white/20 shrink-0">
                  {profile.avatar_url && (
                    <img src={profile.avatar_url} alt={profile.full_name ?? ""} className="object-cover" />
                  )}
                  <AvatarFallback className="bg-white/20 text-white font-bold font-display text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="font-display font-bold text-2xl md:text-3xl leading-tight">
                      {profile.full_name ?? "Isticmaale"}
                    </h1>
                    {profile.is_verified && (
                      <BadgeCheck className="w-6 h-6 text-white/80 shrink-0" />
                    )}
                  </div>

                  {freelancer && (
                    <p className="text-white/85 font-medium text-lg mb-3">
                      {freelancer.role}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {(profile.city || freelancer?.location) && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-white/75">
                        <MapPin className="w-3.5 h-3.5" />
                        {profile.city ?? freelancer?.location}
                      </span>
                    )}
                    {(freelancer?.contact_email || profile.email) && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-white/75">
                        <Mail className="w-3.5 h-3.5" />
                        {freelancer?.contact_email ?? profile.email}
                      </span>
                    )}
                    {contactPhone && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-white/75">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {contactPhone}
                      </span>
                    )}
                    {(freelancer?.portfolio_url || profile.website_url) && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-white/75">
                        <Globe className="w-3.5 h-3.5" />
                        {freelancer?.portfolio_url ?? profile.website_url}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 space-y-8">

              {/* Trust + badges row */}
              <div className="flex items-center gap-2 flex-wrap pb-5 border-b border-border/60">
                <PlanBadge plan={plan} />
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${trust.cls}`}>
                  <Shield className="w-3 h-3" /> {trust.label}
                </span>
                {freelancer?.is_available && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Diyaar u shaqo
                  </span>
                )}
                {freelancer?.rating && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {freelancer.rating} xiddig
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {fmtDate(profile.created_at)}
                </span>
              </div>

              {/* Bio / About */}
              {(freelancer?.bio || profile.bio) && (
                <section>
                  <h2 className="font-display font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    Ku saabsan
                  </h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {freelancer?.bio ?? profile.bio}
                  </p>
                </section>
              )}

              {/* Skills */}
              {freelancer?.skills && freelancer.skills.length > 0 && (
                <section>
                  <h2 className="font-display font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    Xirfadaha
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Trust metrics grid */}
              <section>
                <h2 className="font-display font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  Kalsooni iyo aqoonsi
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Trust Score",
                      value: `${profile.trust_score}/100`,
                      icon: Shield,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      label: "Xaqiijiyay",
                      value: profile.is_verified ? "Haa ✓" : "Maya",
                      icon: BadgeCheck,
                      color: profile.is_verified ? "text-emerald-600" : "text-slate-400",
                      bg: profile.is_verified ? "bg-emerald-50" : "bg-slate-50",
                    },
                    {
                      label: "Qorshe",
                      value: plan.name,
                      icon: Briefcase,
                      color: "text-amber-600",
                      bg: "bg-amber-50",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`rounded-xl ${s.bg} p-4 text-center border border-border/50`}
                    >
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                        <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                      </div>
                      <div className={`font-bold text-sm ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Portfolio links */}
              {(freelancer?.portfolio_url || profile.website_url) && (
                <section>
                  <h2 className="font-display font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    Portfolio iyo Website
                  </h2>
                  <div className="space-y-2">
                    {freelancer?.portfolio_url && (
                      <a
                        href={freelancer.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4 shrink-0" />
                        {freelancer.portfolio_url}
                      </a>
                    )}
                    {profile.website_url && profile.website_url !== freelancer?.portfolio_url && (
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                      >
                        <Globe className="w-4 h-4 shrink-0" />
                        {profile.website_url}
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Hire CTA */}
              {waLink && (
                <div className="bg-primary/5 rounded-xl border border-primary/15 p-6 text-center print:hidden">
                  <p className="font-display font-bold text-slate-900 text-lg mb-1">
                    Diyaar u shaqo?
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Xiriir si toos ah uga bilow shaqada maanta.
                  </p>
                  <a href={waLink} target="_blank" rel="noreferrer">
                    <Button className="gap-2 shadow-sm shadow-primary/20">
                      <MessageSquare className="w-4 h-4" /> Xiriir WhatsApp
                    </Button>
                  </a>
                </div>
              )}

              {/* CV footer */}
              <div className="pt-5 border-t border-border/60 text-center text-xs text-muted-foreground">
                CV-gan waxaa sameeye{" "}
                <span className="font-semibold text-primary">sb-somali-business</span>{" "}
                · Riix "Daabac / PDF" si aad u kaydsato
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
