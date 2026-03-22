import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Briefcase, Clock, CheckCircle2, Share2, Flag, Shield, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useReportJob } from "@/hooks/useJobs";
import { getTrustInfo } from "@/utils/trustScore";
import { shareJobWA } from "@/utils/helpers";
import { REPORT_REASONS } from "@/utils/trustScore";
import type { Job } from "@/lib/supabase";

export function JobCard({ job }: { job: Job }) {
  const { user }  = useAuth();
  const { mutate: report, isPending } = useReportJob();
  const [showRep, setShowRep] = useState(false);
  const [reason,  setReason]  = useState("");
  const [details, setDetails] = useState("");

  const isNew  = new Date(job.posted_at).getTime() > Date.now() - 86_400_000 * 3;
  const trust  = getTrustInfo(job.poster_trust_score ?? 20);
  const isBad  = (job.poster_trust_score ?? 20) < 0;

  function submitReport() {
    if (!reason || !user) return;
    report({ jobId:job.id, reporterId:user.id, reason, details },
      { onSuccess: () => { setShowRep(false); setReason(""); setDetails(""); } });
  }

  return (
    <>
      <article className="group relative bg-white rounded-2xl p-6 border border-border/50 shadow-sm card-hover">
        {/* Bad-actor warning */}
        {isBad && (
          <div className="mb-4 flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <Shield className="w-3.5 h-3.5 shrink-0"/> Qofkani waxaa laga shakiyay — ha u dirin lacag kasta
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
          <div className="space-y-3 flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {isNew && <Badge variant="default" className="bg-primary/10 text-primary border-0 hover:bg-primary/20">Cusub</Badge>}
              <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">{job.type}</Badge>
              {job.is_verified && (
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3"/> Xaqiijiyey
                </Badge>
              )}
              {/* Trust badge */}
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trust.cls}`}>
                <Shield className="w-3 h-3"/> {trust.label}
              </span>
            </div>

            {/* Title */}
            <div>
              <Link href={`/jobs/${job.id}`}>
                <h3 className="font-display font-bold text-lg md:text-xl text-slate-900 group-hover:text-primary transition-colors cursor-pointer leading-tight">
                  {job.title}
                </h3>
              </Link>
              <p className="text-muted-foreground font-medium text-sm mt-1">{job.company}</p>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary/60"/>{job.location}</div>
              {job.salary && <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-primary/60"/>{job.salary}</div>}
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary/60"/>
                {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}
              </div>
              {job.view_count > 0 && (
                <div className="flex items-center gap-1.5 text-xs opacity-60"><Eye className="w-3.5 h-3.5"/>{job.view_count}</div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0">
            <Link href={`/jobs/${job.id}`} className="flex-1 md:flex-none">
              <button className="w-full px-5 py-2.5 rounded-xl bg-slate-50 text-slate-900 font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200 border border-slate-200 hover:border-primary/50">
                Fiiri
              </button>
            </Link>
            <button onClick={() => shareJobWA(job)} title="WhatsApp ku wadaag"
              className="p-2.5 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-500 hover:text-green-600 transition-all">
              <Share2 className="w-4 h-4"/>
            </button>
            {user && (
              <button onClick={() => setShowRep(true)} title="Soo sheeg"
                className="p-2.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                <Flag className="w-4 h-4"/>
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Report dialog */}
      <Dialog open={showRep} onOpenChange={setShowRep}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Flag className="w-5 h-5"/> Soo Sheeg Shaqadan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Haddii shaqadan ay khayaano tahay ama macluumaad been ah, fadlan soo sheeg. Waxaanu si degdeg ah u baari doonaa.
            </p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sababta <span className="text-destructive">*</span></label>
              <select value={reason} onChange={e => setReason(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Dooro sabab...</option>
                {REPORT_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Xog Dheeraad Ah (ikhtiyaari)</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)}
                placeholder="Waxa dhacay ku sharrax..."
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-ring"/>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRep(false)}>Jooji</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700" disabled={!reason || isPending} onClick={submitReport}>
                {isPending ? "Waa la diraya..." : "Soo Sheeg"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
