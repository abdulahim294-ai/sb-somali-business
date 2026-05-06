import { useState } from "react";
import { useRoute, Link } from "wouter";
import {
  Users, CheckCircle2, XCircle, Clock, Eye, MessageSquare,
  Mail, ArrowLeft, Briefcase, AlertCircle, Lock, ChevronDown,
  ChevronUp, UserCircle2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useJob } from "@/hooks/useJobs";
import { useJobApplications, useUpdateApplicationStatus } from "@/hooks/useApplications";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/utils/helpers";
import type { Application } from "@/lib/supabase";

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

function ApplicantCard({
  app,
  onUpdate,
  isPending: isUpdating,
}: {
  app: Application;
  onUpdate: (id: string, status: Application["status"]) => void;
  isPending: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const waLink = app.contact_whatsapp
    ? `https://wa.me/${app.contact_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Salaan! Codsigaaga shaqada waan ku aragnay. Waxaan xiiseynaa in aanu kuula hadalno."
      )}`
    : null;

  return (
    <div className="border-b border-border/50 last:border-0">
      <div className="flex items-start gap-4 p-5">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <UserCircle2 className="w-5 h-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Codsi #{app.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {timeAgo(app.created_at)}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0",
                STATUS_STYLES[app.status]
              )}
            >
              {STATUS_LABELS[app.status]}
            </span>
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap gap-3 mb-2">
            {app.contact_whatsapp && (
              <a
                href={waLink!}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:underline font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
              >
                <MessageSquare className="w-3 h-3" />
                {app.contact_whatsapp}
              </a>
            )}
            {app.contact_email && (
              <a
                href={`mailto:${app.contact_email}`}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium bg-primary/5 px-2.5 py-1 rounded-full border border-primary/20"
              >
                <Mail className="w-3 h-3" />
                {app.contact_email}
              </a>
            )}
          </div>

          {/* Cover letter toggle */}
          {app.cover_letter && (
            <div>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                {expanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                {expanded ? "Xir warqadda" : "Eeg warqadda soo bandhigidda"}
              </button>
              {expanded && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-border/60 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {app.cover_letter}
                </div>
              )}
            </div>
          )}
          {!app.cover_letter && (
            <p className="text-xs text-muted-foreground italic">
              Warqad soo bandhigid lama dirin
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {app.status !== "withdrawn" && (
        <div className="flex flex-wrap gap-2 px-5 pb-5">
          {app.status !== "accepted" && (
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              onClick={() => onUpdate(app.id, "accepted")}
              disabled={isUpdating}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Aqbal
            </Button>
          )}
          {app.status !== "rejected" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => onUpdate(app.id, "rejected")}
              disabled={isUpdating}
            >
              <XCircle className="w-3.5 h-3.5" /> Diid
            </Button>
          )}
          {(app.status === "pending") && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-sky-700 border-sky-200 hover:bg-sky-50"
              onClick={() => onUpdate(app.id, "seen")}
              disabled={isUpdating}
            >
              <Eye className="w-3.5 h-3.5" /> Calaamadi "La arkay"
            </Button>
          )}
          {app.status === "accepted" && waLink && (
            <a href={waLink} target="_blank" rel="noreferrer">
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0"
                variant="outline"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Xiriir WhatsApp
              </Button>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Applicants() {
  const [, params] = useRoute<{ id: string }>("/jobs/:id/applicants");
  const jobId = params?.id ?? "";
  const [showAuth, setShowAuth] = useState(false);

  const { user, loading } = useAuth();
  const { data: job, isLoading: jobLoad } = useJob(jobId);
  const { data: apps, isLoading: appsLoad } = useJobApplications(jobId);
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus();

  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-10 max-w-md w-full text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Soo gal ka hor</h2>
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

  if (jobLoad || appsLoad) {
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

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Shaqada lama helin</h2>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (job.user_id !== user?.id) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Xaq uma lihid</h2>
          <p className="text-muted-foreground mb-6">
            Boggan kaliya daabaciyaha shaqada ayaa arki kara.
          </p>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const total    = apps?.length ?? 0;
  const pending  = apps?.filter((a) => a.status === "pending").length ?? 0;
  const accepted = apps?.filter((a) => a.status === "accepted").length ?? 0;
  const rejected = apps?.filter((a) => a.status === "rejected").length ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container-app max-w-3xl">
          <PageHeader
            crumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: job.title, href: `/jobs/${job.id}` },
              { label: "Codsiyadii" },
            ]}
            title={`Codsiyadii: ${job.title}`}
            subtitle={`${job.company} · ${total} codsi la helay`}
          />

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Wadarta",    value: total,    color: "text-slate-700",    bg: "bg-white" },
              { label: "Sugaya",     value: pending,  color: "text-amber-700",    bg: "bg-amber-50" },
              { label: "La aqbalay", value: accepted, color: "text-emerald-700",  bg: "bg-emerald-50" },
              { label: "La diiday",  value: rejected, color: "text-red-600",      bg: "bg-red-50" },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} rounded-xl border border-border/60 p-4 text-center`}
              >
                <div className={`font-display font-bold text-2xl ${s.color}`}>
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Applicants list */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-primary" />
                Codsigayaasha ({total})
              </h2>
              <Link href={`/jobs/${job.id}`}>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <ArrowLeft className="w-3.5 h-3.5" /> Shaqada
                </Button>
              </Link>
            </div>

            {!apps?.length ? (
              <div className="p-14 text-center">
                <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">
                  Wali codsi lama dirin
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Aad ayaa looga soo jeedinayaa shaqadaada. Iska sabar.
                </p>
              </div>
            ) : (
              <div>
                {apps.map((app) => (
                  <ApplicantCard
                    key={app.id}
                    app={app}
                    onUpdate={(id, status) => updateStatus({ id, status })}
                    isPending={isPending}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-1.5 w-full">
                <ArrowLeft className="w-4 h-4" /> Dib u laabo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
