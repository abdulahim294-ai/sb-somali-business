import { Link } from "wouter";
import {
  ArrowRight,
  Briefcase,
  UserCircle2,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
  BadgeCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { FreelancerCard } from "@/components/FreelancerCard";
import { useJobs } from "@/hooks/useJobs";
import { useFreelancers } from "@/hooks/useFreelancers";
import { SCAM_TIPS } from "@/utils/trustScore";

export default function Home() {
  const { data: jobs, isLoading: jLoad } = useJobs();
  const { data: freelancers, isLoading: fLoad } = useFreelancers();
  const topJobs = jobs?.slice(0, 3) ?? [];
  const topFreel = freelancers?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Scam warning marquee */}
        <div className="bg-amber-500 text-white">
          <div className="container-app py-2.5">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{SCAM_TIPS[0]}</span>
              <span className="hidden md:inline-block opacity-60">•</span>
              <span className="hidden md:inline-block whitespace-nowrap">
                {SCAM_TIPS[1]}
              </span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden bg-white py-16 md:py-24 lg:py-28">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.purple.100)_0%,transparent_45%),radial-gradient(circle_at_bottom_left,theme(colors.amber.50)_0%,transparent_40%)]"
          />
          <div className="container-narrow relative text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-6 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Bilaash 100% — lacag uma baahnid
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.05]">
              Hadal · Shaqo · <span className="text-gradient">Horumar</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Buundada isku xirta ganacsatada iyo xirfadlayaasha Soomaaliyeed.
              Hel shaqo ama shaqaale maanta — si bilaash ah oo ammaan ah.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
              <Link href="/post-job" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base font-semibold"
                >
                  <Briefcase className="w-5 h-5" /> Daabac shaqo
                </Button>
              </Link>
              <Link href="/create-profile" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 rounded-xl bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary transition-all text-base font-semibold"
                >
                  <UserCircle2 className="w-5 h-5" /> Samee profile
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
              {[
                { n: jobs?.length ?? 0,        label: "Shaqooyin",      suffix: "+" },
                { n: freelancers?.length ?? 0, label: "Xirfadlayaal",   suffix: "+" },
                { n: "1,200",                  label: "Isticmaalayaal", suffix: "+" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold font-display text-primary tabular-nums">
                    {s.n}{s.suffix}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust signal strip */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Firfircoon hadda
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                <BadgeCheck className="w-3.5 h-3.5" />
                Trusted Somali Marketplace
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Anti-Scam Protected
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="font-semibold text-slate-700 mr-1">
                Caan ah:
              </span>
              {[
                "Mogadishu",
                "Hargeisa",
                "Remote",
                "Marketing",
                "Design",
                "Tech",
              ].map((t) => (
                <Link key={t} href={`/jobs?search=${t}`}>
                  <span className="inline-block bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-600 px-3 py-1 rounded-full cursor-pointer transition-colors">
                    #{t}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trust pillars */}
        <section className="py-12 bg-background border-y border-border/60">
          <div className="container-app">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Difaac Khayaano (Anti-Scam)",
                  desc: "4 lakab oo xaqiijin ah — shaqaalaha laga ilaalinayo dooxis.",
                },
                {
                  icon: Users,
                  title: "Trust Score",
                  desc: "Dhibco aamin ah — arag cidda la aaminsan yahay ka hor.",
                },
                {
                  icon: TrendingUp,
                  title: "Bilaash & Fudud",
                  desc: "Daabicid shaqo iyo samaynta profile — 100% bilaash.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-border/60 shadow-sm"
                >
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Trust Section */}
        <section className="py-10 bg-white border-b border-border/60">
          <div className="container-app">
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/20 px-4 py-1.5 mb-3">
                <BadgeCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Trusted Somali Marketplace</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Goobtaas aaminsan ee ganacsiga Soomaaliyeed — xaqiijiyay, badbaadiyay, oo firfircoon.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users,       value: "1,200+",  label: "Isticmaalayaal",       color: "text-primary",    bg: "bg-primary/8"    },
                { icon: BadgeCheck,  value: "500+",    label: "Shaqooyin la xaqiijiyay", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: ShieldCheck, value: "98%",     label: "Anti-Scam Score",      color: "text-amber-600",  bg: "bg-amber-50"     },
                { icon: Zap,         value: "🇸🇴 SO",  label: "Dhammaan degaannada",  color: "text-violet-600", bg: "bg-violet-50"    },
              ].map(({ icon: Icon, value, label, color, bg }) => (
                <div key={label} className={`rounded-2xl ${bg} border border-border/50 p-5 flex flex-col items-center text-center gap-2`}>
                  <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <span className={`text-2xl font-bold font-display ${color}`}>{value}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container-app">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="section-eyebrow mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Cusub
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-1">
                  Shaqooyinka cusub
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Fursadaha ugu dambeeyay ee la xaqiijiyay
                </p>
              </div>
              <Link
                href="/jobs"
                className="hidden md:inline-flex items-center text-primary font-semibold hover:underline text-sm"
              >
                Dhammaan <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            {jLoad ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-36 skeleton" />
                ))}
              </div>
            ) : topJobs.length === 0 ? (
              <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-border">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="font-semibold text-slate-900">
                  Shaqo cusub weli ma jirto
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Markaad eegtid mar dambe waxaad heli kartaa shaqooyin cusub.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topJobs.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
            )}
            <div className="mt-6 text-center md:hidden">
              <Link
                href="/jobs"
                className="inline-flex items-center text-primary font-semibold"
              >
                Dhammaan shaqooyinka <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Top Freelancers */}
        <section className="py-16 md:py-20 bg-slate-50/40">
          <div className="container-app">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="section-eyebrow mb-2">
                  <Users className="w-3.5 h-3.5" /> Xirfadlayaal
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-1">
                  Xirfadlayaasha ugu fiican
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Diyaar u ah mashruucaaga
                </p>
              </div>
              <Link
                href="/freelancers"
                className="hidden md:inline-flex items-center text-primary font-semibold hover:underline text-sm"
              >
                Dhammaan <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            {fLoad ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-72 skeleton" />
                ))}
              </div>
            ) : topFreel.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
                <div className="text-4xl mb-3">👤</div>
                <h3 className="font-semibold text-slate-900">
                  Weli xirfadlayaal lama diiwaangelin
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Noqo kii ugu horreeyay!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topFreel.map((f) => (
                  <FreelancerCard key={f.id} freelancer={f} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-primary text-white relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_45%)]"
          />
          <div className="container-narrow text-center relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Maanta bilow — bilaash ah
            </h2>
            <p className="opacity-90 mb-8 text-lg max-w-xl mx-auto">
              Ku biir kumannaan isticmaale oo Soomaaliyeed — daabac shaqo ama
              hel shaqo. Lacag uma baahnid.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto bg-white/15 text-white border-white/30 hover:bg-white/25 backdrop-blur"
                >
                  Raadi shaqo
                </Button>
              </Link>
              <Link href="/post-job">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold"
                >
                  Daabac shaqo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
