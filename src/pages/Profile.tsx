import { useRoute, Link } from "wouter";
import {
  MapPin,
  Star,
  BadgeCheck,
  MessageSquare,
  Globe,
  Mail,
  Shield,
  Briefcase,
  Calendar,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlanBadge } from "@/components/PlanBadge";
import { PageHeader } from "@/components/PageHeader";
import { supabase, type Profile as TProfile, type Freelancer } from "@/lib/supabase";
import { getPlan } from "@/lib/plans";
import { getTrustInfo } from "@/utils/trustScore";
import { fmtDate } from "@/utils/helpers";

async function fetchPublicProfile(id: string) {
  const [{ data: profile }, { data: freelancers }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.from("freelancers").select("*").eq("user_id", id),
  ]);
  return {
    profile: profile as TProfile | null,
    freelancer: (freelancers?.[0] as Freelancer | null) ?? null,
  };
}

export default function Profile() {
  const [, params] = useRoute<{ id: string }>("/profile/:id");
  const userId = params?.id ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["public-profile", userId],
    queryFn: () => fetchPublicProfile(userId),
    enabled: !!userId,
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
          <h2 className="font-display text-xl font-bold mb-2">
            Profile lama helin
          </h2>
          <p className="text-muted-foreground mb-6">
            Isticmaaluhu ma jiro ama waa la tirtiray.
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
    ? profile.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : profile.email?.[0]?.toUpperCase() ?? "U";

  const trust = getTrustInfo(profile.trust_score);
  const plan = getPlan(profile.plan);

  const waLink = (freelancer?.contact_whatsapp || profile.phone)
    ? `https://wa.me/${((freelancer?.contact_whatsapp ?? profile.phone ?? "")).replace(/\D/g, "")}?text=${encodeURIComponent(
        `Salaan! Waxaan ku arkay profile-kaaga SB Somali Business. Waxaan xiiseynayaa shaqo.`
      )}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container-app max-w-4xl">
          <PageHeader
            crumbs={[
              { label: "Xirfadlayaal", href: "/freelancers" },
              { label: profile.full_name ?? "Profile" },
            ]}
            title=""
          />

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left sidebar */}
            <div className="space-y-5">
              {/* Profile card */}
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 border-4 border-primary/10 mx-auto">
                    {profile.avatar_url && (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name ?? ""}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-primary/5 text-primary font-bold font-display text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {profile.is_verified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <BadgeCheck className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  {freelancer?.is_available && (
                    <span
                      className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
                      title="Diyaar"
                    />
                  )}
                </div>

                <h1 className="font-display font-bold text-xl text-slate-900">
                  {profile.full_name ?? "Isticmaale"}
                </h1>
                {freelancer && (
                  <p className="text-primary font-medium text-sm mt-0.5">
                    {freelancer.role}
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                  <PlanBadge plan={plan} />
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${trust.cls}`}
                  >
                    <Shield className="w-3 h-3" /> {trust.label}
                  </span>
                </div>

                {freelancer && (
                  <div className="flex items-center justify-center gap-1 mt-3">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-700 text-sm">
                      {freelancer.rating}
                    </span>
                  </div>
                )}

                {(profile.city || freelancer?.location) && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground mt-2">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {profile.city ?? freelancer?.location}
                  </div>
                )}

                {waLink && (
                  <a href={waLink} target="_blank" rel="noreferrer" className="block mt-4">
                    <Button className="w-full gap-2">
                      <MessageSquare className="w-4 h-4" /> WhatsApp
                    </Button>
                  </a>
                )}
                {(freelancer?.contact_email || profile.email) && (
                  <a
                    href={`mailto:${freelancer?.contact_email ?? profile.email}`}
                    className="block mt-2"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </Button>
                  </a>
                )}
              </div>

              {/* Info */}
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Xog guud
                </p>
                {[
                  {
                    icon: Calendar,
                    label: "Ku biirtay",
                    value: fmtDate(profile.created_at),
                  },
                  {
                    icon: Shield,
                    label: "Trust Score",
                    value: `${profile.trust_score}/100`,
                  },
                  freelancer?.portfolio_url
                    ? {
                        icon: ExternalLink,
                        label: "Portfolio",
                        value: "Eeg shaqada",
                        href: freelancer.portfolio_url,
                      }
                    : null,
                  profile.website_url
                    ? {
                        icon: Globe,
                        label: "Website",
                        value: profile.website_url,
                        href: profile.website_url,
                      }
                    : null,
                ]
                  .filter(Boolean)
                  .map((item: any, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <item.icon className="w-4 h-4 text-primary/60 shrink-0" />
                      <span className="text-muted-foreground">{item.label}:</span>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="font-medium text-slate-700 truncate">
                          {item.value}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Right — main content */}
            <div className="md:col-span-2 space-y-5">
              {/* Bio */}
              {(freelancer?.bio || profile.bio) && (
                <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
                  <h2 className="font-display font-bold text-slate-900 mb-3">
                    Ku saabsan
                  </h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                    {freelancer?.bio ?? profile.bio}
                  </p>
                </div>
              )}

              {/* Skills */}
              {freelancer?.skills && freelancer.skills.length > 0 && (
                <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
                  <h2 className="font-display font-bold text-slate-900 mb-4">
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
                </div>
              )}

              {/* Trust section */}
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
                <h2 className="font-display font-bold text-slate-900 mb-4">
                  Kalsooni
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Trust Score",
                      value: `${profile.trust_score}/100`,
                      icon: Shield,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      label: "Qorshaha",
                      value: plan.name,
                      icon: Briefcase,
                      color: "text-amber-600",
                      bg: "bg-amber-50",
                    },
                    {
                      label: "Xaqiijiyay",
                      value: profile.is_verified ? "Haa" : "Maya",
                      icon: BadgeCheck,
                      color: "text-emerald-600",
                      bg: "bg-emerald-50",
                    },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div
                        className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}
                      >
                        <s.icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <div className={`font-bold text-sm ${s.color}`}>
                        {s.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Back navigation */}
              <Link href="/freelancers">
                <Button variant="outline" className="gap-1.5 w-full">
                  <ArrowLeft className="w-4 h-4" /> Dib u laabo xirfadlayaasha
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
