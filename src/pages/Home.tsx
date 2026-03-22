import { Link } from "wouter";
import { ArrowRight, Briefcase, UserCircle2, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { FreelancerCard } from "@/components/FreelancerCard";
import { useJobs } from "@/hooks/useJobs";
import { useFreelancers } from "@/hooks/useFreelancers";
import { SCAM_TIPS } from "@/utils/trustScore";

export default function Home() {
  const { data: jobs,        isLoading: jLoad } = useJobs();
  const { data: freelancers, isLoading: fLoad } = useFreelancers();
  const topJobs   = jobs?.slice(0,3)        ?? [];
  const topFreel  = freelancers?.slice(0,3) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Header/>

      <main className="flex-1">
        {/* ── Scam warning banner ── */}
        <div className="bg-amber-500 text-white">
          <div className="container mx-auto px-4 max-w-6xl py-2.5">
            <div className="flex items-center gap-3 text-sm font-medium overflow-x-auto">
              <ShieldCheck className="w-4 h-4 shrink-0"/>
              <span className="whitespace-nowrap">{SCAM_TIPS[0]}</span>
              <span className="hidden md:inline-block opacity-60">•</span>
              <span className="hidden md:inline-block whitespace-nowrap">{SCAM_TIPS[1]}</span>
            </div>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-white py-16 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.purple.50),transparent_40%)]"/>
          <div className="container relative mx-auto px-4 text-center max-w-4xl">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Hadal, Shaqo, <span className="text-gradient">Horumar</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Ku soo dhawoow buundada isku xirta Ganacsatada iyo Xirfadlayaasha Soomaaliyeed.
              Hel shaqo ama shaqaale maanta — bilaash &amp; ammaan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/post-job" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all text-base">
                  <Briefcase className="w-5 h-5"/> Ganacsade (Client)
                </Button>
              </Link>
              <Link href="/create-profile" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full h-14 px-8 rounded-xl bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary transition-all text-base">
                  <UserCircle2 className="w-5 h-5"/> Shaqaale (Freelancer)
                </Button>
              </Link>
            </div>
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {[
                { n: jobs?.length        ?? 0, label:"Shaqo Active" },
                { n: freelancers?.length ?? 0, label:"Xirfadlayaal" },
                { n: "100%",                   label:"Bilaash" },
              ].map(({ n, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold font-display text-primary">{n}+</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="font-semibold text-slate-800">Popular:</span>
              {["#Mogadishu","#Hargeisa","#Remote","#Marketing","#Design","#Tech"].map(t => (
                <Link key={t} href={`/jobs?search=${t.slice(1)}`}>
                  <span className="bg-slate-100 hover:bg-primary/10 hover:text-primary px-3 py-1 rounded-full cursor-pointer transition-colors">{t}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust pillars ── */}
        <section className="py-10 bg-slate-50/50 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon:ShieldCheck, title:"Anti-Scam Xoog Leh",   desc:"4 Layer oo xaqiijinaya in aan khayaano lagu shirin shaqaalaha" },
                { icon:Users,       title:"Trust Score System",    desc:"Dhibco aamin — arki kartaa cidda la aaminsan yahay" },
                { icon:TrendingUp,  title:"Bilaash & Fur",         desc:"Shaqo daabicid iyo profile samaysasho — 100% bilaash" },
              ].map(({ icon:Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary"/>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Jobs ── */}
        <section className="py-16 bg-slate-50/50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">🔥 Shaqooyinka Cusub</h2>
                <p className="text-muted-foreground mt-1">Fursadaha ugu dambeeyay ee la hubiyey</p>
              </div>
              <Link href="/jobs" className="hidden md:flex items-center text-primary font-semibold hover:underline text-sm">
                Dhammaan <ArrowRight className="w-4 h-4 ml-1"/>
              </Link>
            </div>
            {jLoad ? (
              <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl"/>)}</div>
            ) : topJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
                <p className="text-muted-foreground">Haddeer shaqo cusub ma jirto. Dib u eeg.</p>
              </div>
            ) : (
              <div className="space-y-4">{topJobs.map(j => <JobCard key={j.id} job={j}/>)}</div>
            )}
            <div className="mt-6 text-center md:hidden">
              <Link href="/jobs" className="inline-flex items-center text-primary font-semibold">
                Dhammaan Shaqooyinka <ArrowRight className="w-4 h-4 ml-1"/>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Top Freelancers ── */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">🌟 Xirfadlayaasha Ugu Fiican</h2>
                <p className="text-muted-foreground mt-1">Diyaar u ah mashruucaaga</p>
              </div>
              <Link href="/freelancers" className="hidden md:flex items-center text-primary font-semibold hover:underline text-sm">
                Dhammaan <ArrowRight className="w-4 h-4 ml-1"/>
              </Link>
            </div>
            {fLoad ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl"/>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topFreel.map(f => <FreelancerCard key={f.id} freelancer={f}/>)}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="font-display text-3xl font-bold mb-4">Bilaw Maanta — Bilaash</h2>
            <p className="opacity-80 mb-8">Ku biir isticmaalayaasha shaqo raadiya iyo shaqaale u baahan Somalia. Lacag uma baahna.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs"><Button size="lg" variant="secondary" className="w-full sm:w-auto">Shaqo Raadi</Button></Link>
              <Link href="/post-job"><Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">Shaqo Daabac</Button></Link>
            </div>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  );
}
