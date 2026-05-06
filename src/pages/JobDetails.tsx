import { useState } from "react";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import {
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  MessageSquare,
  Mail,
  AlertCircle,
  ArrowLeft,
  Share2,
  Flag,
  Shield,
  CheckCircle2,
  Send,
  Crown,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportDialog } from "@/components/ReportDialog";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useJob, useReportJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { usePlan, useCanApply } from "@/hooks/usePlan";
import { getTrustInfo, SCAM_TIPS } from "@/utils/trustScore";
import { shareJobWA, contactEmployerWA } from "@/utils/helpers";
import { cn } from "@/lib/utils";

export default function JobDetails() {
  const [, params] = useRoute<{ id: string }>("/jobs/:id");
  const id = params?.id ?? "";
  const { data: job, isLoading } = useJob(id);
  const { user } = useAuth();
  const { plan } = usePlan();
  const canApply = useCanApply();
  const { mutate: report, isPending } = useReportJob();
  const [showRep, setShowRep] = useState(false);

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );

  if (!job)
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <AlertCircle className="w-14 h-14 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Shaqada lama helin
          </h1>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Waxaa laga yaabaa in la tirtiray ama mudadeedu dhammaatay.
          </p>
          <Link href="/jobs">
            <Button>Eeg shaqooyinka kale</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );

  const trust = getTrustInfo(job.poster_trust_score ?? 20);
  const isBad = (job.poster_trust_score ?? 20) < 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container-app max-w-4xl">
          <Breadcrumb
            items={[
              { label: "Shaqooyin", href: "/jobs" },
              { label: job.title },
            ]}
            className="mb-6"
          />

          {isBad && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
              <Shield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Digniin: </span>
                Qofka daabacay shaqadan waxaa laga shakiyay. Ha u dirin lacag
                uun.
              </div>
            </div>
          )}

          <div className="scam-banner mb-6">
            <Shield className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-xs">
              {SCAM_TIPS[0]}. {SCAM_TIPS[2]}.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border/60 overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-border/60 bg-slate-50/40">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {job.type}
                    </Badge>
                    {job.is_verified && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" /> La xaqiijiyay
                      </Badge>
                    )}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                        trust.cls
                      )}
                      title={trust.tip}
                    >
                      <Shield className="w-3 h-3" /> {trust.label}
                    </span>
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-lg font-medium text-slate-600">
                    {job.company}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2 md:min-w-[220px]">
                  {/* Primary Apply CTA */}
                  {user ? (
                    canApply ? (
                      <Link href={`/jobs/${job.id}/apply`}>
                        <Button className="w-full gap-2 h-11 font-semibold shadow-sm shadow-primary/20">
                          <Send className="w-4 h-4" /> Codso shaqadan
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/pricing">
                        <Button
                          className="w-full gap-2 h-11 bg-amber-500 hover:bg-amber-600 font-semibold"
                        >
                          <Crown className="w-4 h-4" /> Kor u qaad — codso
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Link href={`/jobs/${job.id}/apply`}>
                      <Button className="w-full gap-2 h-11 font-semibold">
                        <Send className="w-4 h-4" /> Codso shaqadan
                      </Button>
                    </Link>
                  )}

                  {job.contact_whatsapp && (
                    <a
                      href={contactEmployerWA(job.contact_whatsapp, job.title)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="outline" className="w-full gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp
                      </Button>
                    </a>
                  )}
                  {job.contact_email && (
                    <a
                      href={`mailto:${job.contact_email}?subject=${encodeURIComponent(
                        `Codsi shaqo: ${job.title}`
                      )}`}
                    >
                      <Button variant="outline" className="w-full gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </Button>
                    </a>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      onClick={() => shareJobWA(job)}
                    >
                      <Share2 className="w-4 h-4" /> Wadaag
                    </Button>
                    {user && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setShowRep(true)}
                      >
                        <Flag className="w-4 h-4" /> Soo sheeg
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/60">
                {[
                  { icon: MapPin, text: job.location },
                  { icon: Briefcase, text: job.salary ?? job.type },
                  {
                    icon: Clock,
                    text:
                      job.status === "active" ? "Firfircoon" : job.status,
                  },
                  {
                    icon: Calendar,
                    text: job.posted_at
                      ? format(new Date(job.posted_at), "MMM d, yyyy")
                      : "—",
                  },
                ].map(({ icon: Icon, text }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <Icon className="w-4 h-4 text-primary/70 shrink-0" />
                    <span className="truncate">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">
                Faahfaahinta shaqada
              </h3>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>

              {/* Apply CTA inline */}
              <div className="mt-8 p-5 bg-primary/5 rounded-xl border border-primary/15 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    Xiiseynaysaa shaqadan?
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Codso hadda si aad uga faa'iidaysato fursadan.
                  </p>
                </div>
                <Link href={user ? `/jobs/${job.id}/apply` : `/jobs/${job.id}/apply`}>
                  <Button className="gap-2 font-semibold shrink-0">
                    <Send className="w-4 h-4" /> Codso hadda
                  </Button>
                </Link>
              </div>

              {/* Safety box */}
              <div className="mt-8 p-5 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <h4 className="font-semibold text-amber-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Ammaan iyo xaqiijin
                </h4>
                <ul className="space-y-1.5">
                  {SCAM_TIPS.map((tip, i) => (
                    <li key={i} className="text-sm text-amber-800">
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 mt-2 border-t border-amber-200/80 text-xs font-medium text-amber-900">
                  Ref ID: #{job.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <ReportDialog
        open={showRep}
        onOpenChange={setShowRep}
        isPending={isPending}
        onSubmit={(reason, details) =>
          user &&
          report(
            { jobId: job.id, reporterId: user.id, reason, details },
            { onSuccess: () => setShowRep(false) }
          )
        }
      />
    </div>
  );
}
