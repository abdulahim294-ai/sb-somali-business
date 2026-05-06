import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Briefcase, Send, Star, Shield, PlusCircle, UserCircle2,
  ArrowRight, ChevronRight, CheckCircle2, Clock, XCircle, Eye,
  Crown, Sparkles, TrendingUp, AlertCircle, Trash2, Users,
  Settings, FileText,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanBadge } from "@/components/PlanBadge";
import { PageHeader } from "@/components/PageHeader";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { usePlan } from "@/hooks/usePlan";
import { useMyJobs, useDeleteJob } from "@/hooks/useJobs";
import { useMyApplications, useWithdrawApplication } from "@/hooks/useApplications";
import { useFreelancers } from "@/hooks/useFreelancers";
import { getProfileCompletion } from "@/lib/profileCompletion";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/utils/helpers";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  seen:      "bg-sky-50 text-sky-700 border-sky-200",
  accepted:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected:  "bg-red-50 text-red-700 border-red-200",
  withdrawn: "bg-slate-100 text-slate-500 border-slate-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending:   "Sugaya",
  seen:      "La arkay",
  accepted:  "La aqbalay",
  rejected:  "La diiday",
  withdrawn: "La joojiyay",
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  pending:   Clock,
  seen:      Eye,
  accepted:  CheckCircle2,
  rejected:  XCircle,
  withdrawn: XCircle,
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const { user, profile, loading } = useAuth();
  const { plan } = usePlan();

  const { data: myJobs, isLoading: jobsLoad } = useMyJobs(user?.id ?? null);
  const { data: myApps, isLoading: appsLoad } = useMyApplications(user?.id ?? null);
  const { data: allFreelancers } = useFreelancers();

  const { mutate: deleteJob, isPending: deleting } = useDeleteJob();
  const { mutate: withdrawApp, isPending: withdrawing } = useWithdrawApplication();

  const myFreelancer = allFreelancers?.find((f) => f.user_id === user?.id);
  const { pct, missing } = getProfileCompletion(profile, myFreelancer);

  // ── Auth gate ──────────────────────────────────────────────────
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <UserCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
              Soo gal xisaabta
            </h2>
            <p className="text-muted-foreground mb-7">
              Dashboard-ka waxaa arki kara xisaab hayaha kaliya.
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

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  function handleDeleteJob(id: string) {
    deleteJob(id, { onSuccess: () => setConfirmDeleteId(null) });
  }

  function handleWithdraw(id: string) {
    setWithdrawingId(id);
    withdrawApp(id, { onSettled: () => setWithdrawingId(null) });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-10">
        <div className="container-app">
          <PageHeader
            crumbs={[{ label: "Dashboard" }]}
            title={`Soo dhawoow${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!`}
            subtitle="Xog guud oo ku saabsan xisaabta iyo hawlaha socda."
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* ── Left column (2/3) ───────────────────────────────── */}
            <div className="xl:col-span-2 space-y-6">

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    icon: Shield,
                    label: "Trust Score",
                    value: loading ? "—" : `${profile?.trust_score ?? 20}/100`,
                    color: "text-primary",
                    bg: "bg-primary/10",
                  },
                  {
                    icon: Briefcase,
                    label: "Shaqo la daabacay",
                    value: loading ? "—" : String(myJobs?.length ?? 0),
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    icon: Send,
                    label: "Codsi la diray",
                    value: loading ? "—" : String(myApps?.length ?? 0),
                    color: "text-sky-600",
                    bg: "bg-sky-50",
                  },
                  {
                    icon: Star,
                    label: "Dhamaystiran",
                    value: loading ? "—" : `${pct}%`,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-xl border border-border/60 p-4 flex flex-col gap-2"
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", s.bg)}>
                      <s.icon className={cn("w-4.5 h-4.5", s.color)} />
                    </div>
                    <div>
                      <div className="font-display font-bold text-xl text-slate-900 tabular-nums">
                        {loading ? <div className="h-6 w-12 skeleton inline-block" /> : s.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── My Jobs ─────────────────────────────────────── */}
              <section className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                  <h2 className="font-display font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4.5 h-4.5 text-primary" />
                    Shaqooyinkayga ({myJobs?.length ?? 0})
                  </h2>
                  <Link href="/post-job">
                    <Button size="sm" className="gap-1.5 text-xs">
                      <PlusCircle className="w-3.5 h-3.5" /> Daabac
                    </Button>
                  </Link>
                </div>

                {jobsLoad ? (
                  <div className="p-5 space-y-3">
                    {[1, 2].map((i) => <div key={i} className="h-16 skeleton" />)}
                  </div>
                ) : !myJobs?.length ? (
                  <div className="p-10 text-center">
                    <Briefcase className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="font-semibold text-slate-700 mb-1">Weli shaqo ma daabacin</p>
                    <p className="text-sm text-muted-foreground mb-4">Daabac shaqadaada hore ee maanta.</p>
                    <Link href="/post-job">
                      <Button size="sm" variant="outline">Daabac shaqo</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {myJobs.map((j) => (
                      <div key={j.id}>
                        {/* Confirm delete overlay */}
                        {confirmDeleteId === j.id && (
                          <div className="px-5 py-3 bg-red-50 border-b border-red-200 flex items-center justify-between gap-3 flex-wrap">
                            <p className="text-sm font-medium text-red-700">
                              Tirtir "{j.title}"? Xogtan lama soo celin karo.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs border-red-200 text-red-600 hover:bg-red-100"
                                onClick={() => handleDeleteJob(j.id)}
                                disabled={deleting}
                              >
                                {deleting ? "..." : "Haa, tirtir"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                Jooji
                              </Button>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                          <div className="min-w-0 flex-1">
                            <Link href={`/jobs/${j.id}`}>
                              <p className="font-semibold text-sm text-slate-900 truncate hover:text-primary transition-colors cursor-pointer">
                                {j.title}
                              </p>
                            </Link>
                            <div className="flex items-center gap-3 flex-wrap mt-0.5">
                              <p className="text-xs text-muted-foreground">
                                {j.company} · {timeAgo(j.posted_at)}
                                {j.view_count > 0 && (
                                  <span className="ml-2 inline-flex items-center gap-0.5">
                                    <Eye className="w-3 h-3" /> {j.view_count}
                                  </span>
                                )}
                              </p>
                              <Link href={`/jobs/${j.id}/applicants`}>
                                <span className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                                  <Users className="w-3 h-3" /> Codsiyadii
                                </span>
                              </Link>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge
                              variant={j.status === "active" ? "success" : "secondary"}
                              className="text-[11px]"
                            >
                              {j.status === "active" ? "Firfircoon" : j.status}
                            </Badge>
                            <Link href={`/jobs/${j.id}`}>
                              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                              onClick={() => setConfirmDeleteId(confirmDeleteId === j.id ? null : j.id)}
                              title="Tirtir shaqada"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ── My Applications ─────────────────────────────── */}
              <section className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                  <h2 className="font-display font-bold text-slate-900 flex items-center gap-2">
                    <Send className="w-4.5 h-4.5 text-primary" />
                    Codsiyada la diray ({myApps?.length ?? 0})
                  </h2>
                  <Link href="/jobs">
                    <Button size="sm" variant="outline" className="text-xs">
                      Raadi shaqo
                    </Button>
                  </Link>
                </div>

                {appsLoad ? (
                  <div className="p-5 space-y-3">
                    {[1, 2].map((i) => <div key={i} className="h-14 skeleton" />)}
                  </div>
                ) : !myApps?.length ? (
                  <div className="p-10 text-center">
                    <Send className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="font-semibold text-slate-700 mb-1">Weli codsi ma dirin</p>
                    <p className="text-sm text-muted-foreground mb-4">Raadi shaqo oo si toos ah u codso.</p>
                    <Link href="/jobs">
                      <Button size="sm" variant="outline">Raadi shaqooyin</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {myApps.map((a) => {
                      const Icon = STATUS_ICONS[a.status] ?? Clock;
                      const canWithdraw = a.status === "pending" || a.status === "seen";
                      return (
                        <div
                          key={a.id}
                          className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50/40 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-slate-900 truncate">
                              {(a.jobs as any)?.title ?? "Shaqo"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {(a.jobs as any)?.company} · {timeAgo(a.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border",
                                STATUS_STYLES[a.status]
                              )}
                            >
                              <Icon className="w-3 h-3" />
                              {STATUS_LABELS[a.status]}
                            </span>
                            {canWithdraw && (
                              <button
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Jooji codsiga"
                                disabled={withdrawingId === a.id || withdrawing}
                                onClick={() => handleWithdraw(a.id)}
                              >
                                {withdrawingId === a.id ? (
                                  <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* ── Right column (1/3) ──────────────────────────────── */}
            <div className="space-y-5">

              {/* Profile card */}
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-display font-bold text-xl text-primary shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {profile?.full_name ?? "Isticmaale"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    <div className="mt-1.5">
                      <PlanBadge plan={plan} />
                    </div>
                  </div>
                </div>

                {/* Profile completion bar */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Profile dhamaystiran</span>
                    <span className="font-bold text-primary">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background:
                          pct >= 80
                            ? "hsl(142 70% 45%)"
                            : pct >= 50
                              ? "hsl(var(--primary))"
                              : "hsl(38 90% 50%)",
                      }}
                    />
                  </div>
                </div>

                {/* Missing items */}
                {missing.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Tallaabada xigta
                    </p>
                    {missing.slice(0, 3).map((m) => (
                      <Link
                        key={m.label}
                        href={m.href ?? "#"}
                        className="flex items-center justify-between gap-2 text-xs p-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors group"
                      >
                        <div className="flex items-center gap-2 text-slate-600 group-hover:text-primary">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          {m.label}
                        </div>
                        <ChevronRight className="w-3 h-3 opacity-50" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Plan card */}
              <div
                className={cn(
                  "rounded-2xl border p-5",
                  plan.id === "premium"
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 text-white"
                    : plan.id === "free_pro"
                      ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                      : "bg-white border-border/60"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wide mb-0.5",
                        plan.id === "premium" ? "text-emerald-100" : "text-muted-foreground"
                      )}
                    >
                      Qorshahaaga
                    </p>
                    <p
                      className={cn(
                        "font-display font-bold text-lg",
                        plan.id === "premium" ? "text-white" : "text-slate-900"
                      )}
                    >
                      {plan.name}
                    </p>
                  </div>
                  {plan.id === "premium" ? (
                    <Crown className="w-8 h-8 text-emerald-100" />
                  ) : (
                    <TrendingUp className="w-8 h-8 text-primary/40" />
                  )}
                </div>

                <div
                  className={cn(
                    "text-xs space-y-1 mb-4",
                    plan.id === "premium" ? "text-emerald-100" : "text-muted-foreground"
                  )}
                >
                  <div>
                    Shaqo / bil:{" "}
                    <span className="font-semibold">
                      {plan.limits.jobsPerMonth < 0 ? "Aan xaddidnayn" : plan.limits.jobsPerMonth}
                    </span>
                  </div>
                  <div>
                    Codsi / bil:{" "}
                    <span className="font-semibold">
                      {plan.limits.appsPerMonth < 0 ? "Aan xaddidnayn" : plan.limits.appsPerMonth}
                    </span>
                  </div>
                </div>

                {plan.id !== "premium" && (
                  <Link href="/pricing">
                    <Button
                      size="sm"
                      className="w-full gap-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white border-0"
                      variant="outline"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Kor u qaad qorshaha
                    </Button>
                  </Link>
                )}
              </div>

              {/* Quick actions */}
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
                <p className="font-semibold text-slate-900 mb-3 text-sm">Hawl degdeg</p>
                <div className="space-y-1">
                  {[
                    { href: "/post-job",       icon: PlusCircle,  label: "Daabac shaqo",              color: "text-primary"     },
                    { href: "/create-profile",  icon: UserCircle2, label: "Samee/cusbooneysii profile", color: "text-emerald-600" },
                    { href: "/settings",        icon: Settings,    label: "Goobta xisaabta",            color: "text-slate-600"   },
                    { href: `/cv/${user?.id}`,  icon: FileText,    label: "Eeg CV-gaaga",               color: "text-sky-600"     },
                    { href: "/jobs",            icon: Briefcase,   label: "Raadi shaqooyin",            color: "text-indigo-600"  },
                    { href: "/pricing",         icon: Crown,       label: "Eeg qorshooyinka",           color: "text-amber-600"   },
                  ].map((a) => (
                    <Link key={a.href} href={a.href}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                        <a.icon className={cn("w-4 h-4 shrink-0", a.color)} />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors flex-1">
                          {a.label}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
