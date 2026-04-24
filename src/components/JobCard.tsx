import { useState } from "react";
import { Link } from "wouter";
import {
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  Share2,
  Flag,
  Shield,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useReportJob } from "@/hooks/useJobs";
import { getTrustInfo } from "@/utils/trustScore";
import { shareJobWA } from "@/utils/helpers";
import { ReportDialog } from "@/components/ReportDialog";
import type { Job } from "@/lib/supabase";

export function JobCard({ job }: { job: Job }) {
  const { user } = useAuth();
  const { mutate: report, isPending } = useReportJob();
  const [showRep, setShowRep] = useState(false);

  const isNew = new Date(job.posted_at).getTime() > Date.now() - 86_400_000 * 3;
  const trust = getTrustInfo(job.poster_trust_score ?? 20);
  const isBad = (job.poster_trust_score ?? 20) < 0;

  return (
    <>
      <article className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-border/60 shadow-sm card-hover">
        {isBad && (
          <div className="mb-4 flex items-center gap-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <Shield className="w-3.5 h-3.5 shrink-0" /> Qofkani waxaa laga
            shakiyay — ha u dirin lacag.
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:items-start md:justify-between">
          <div className="space-y-3 flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {isNew && (
                <Badge
                  variant="default"
                  className="bg-primary/10 text-primary border-0 hover:bg-primary/15"
                >
                  Cusub
                </Badge>
              )}
              <Badge
                variant="outline"
                className="border-purple-200 text-purple-700 bg-purple-50"
              >
                {job.type}
              </Badge>
              {job.is_verified && (
                <Badge
                  variant="success"
                  className="flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" /> La xaqiijiyay
                </Badge>
              )}
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${trust.cls}`}
                title={trust.tip}
              >
                <Shield className="w-3 h-3" /> {trust.label}
              </span>
            </div>

            {/* Title */}
            <div>
              <Link href={`/jobs/${job.id}`}>
                <h3 className="font-display font-bold text-lg md:text-xl text-slate-900 group-hover:text-primary transition-colors cursor-pointer leading-snug">
                  {job.title}
                </h3>
              </Link>
              <p className="text-slate-600 font-medium text-sm mt-1">
                {job.company}
              </p>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary/70" />
                {job.location}
              </div>
              {job.salary && (
                <div className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-primary/70" />
                  {job.salary}
                </div>
              )}
              <div className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary/70" />
                {formatDistanceToNow(new Date(job.posted_at), {
                  addSuffix: true,
                })}
              </div>
              {job.view_count > 0 && (
                <div className="inline-flex items-center gap-1.5 text-xs opacity-70">
                  <Eye className="w-3.5 h-3.5" />
                  {job.view_count}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-row md:flex-col md:items-end gap-2 shrink-0 md:w-auto">
            <Link
              href={`/jobs/${job.id}`}
              className="flex-1 md:flex-none"
            >
              <button className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20">
                Eeg <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <button
              onClick={() => shareJobWA(job)}
              title="Wadaag WhatsApp"
              aria-label="Wadaag WhatsApp"
              className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {user && (
              <button
                onClick={() => setShowRep(true)}
                title="Soo sheeg"
                aria-label="Soo sheeg shaqada"
                className="p-2.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Flag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </article>

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
    </>
  );
}
