import { useState } from "react";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { MapPin, Briefcase, Clock, Calendar, MessageSquare, Mail, AlertCircle, ArrowLeft, Share2, Flag, Shield } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useJob, useReportJob } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { getTrustInfo, SCAM_TIPS, REPORT_REASONS } from "@/utils/trustScore";
import { shareJobWA, contactEmployerWA } from "@/utils/helpers";

export default function JobDetails() {
  const [, params]   = useRoute("/jobs/:id");
  const id           = params?.id ?? "";
  const { data: job, isLoading } = useJob(id);
  const { user }     = useAuth();
  const { mutate: report, isPending } = useReportJob();
  const [showRep, setShowRep] = useState(false);
  const [reason,  setReason]  = useState("");
  const [details, setDetails] = useState("");

  function submitReport() {
    if (!reason || !user || !job) return;
    report({ jobId:job.id, reporterId:user.id, reason, details },
      { onSuccess: () => { setShowRep(false); setReason(""); setDetails(""); } });
  }

  if (isLoading) return (
    <div className="min-h-screen flex flex-col"><Header/>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"/>
      </div>
      <Footer/>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex flex-col"><Header/>
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="w-14 h-14 text-muted-foreground mb-4"/>
        <h1 className="text-2xl font-display font-bold text-slate-900">Shaqada la ma helin</h1>
        <p className="text-muted-foreground mb-6">Waxaa laga yaabaa in la tirtiray ama mudadeedu dhammaatay.</p>
        <Link href="/jobs"><Button>Raadi Shaqooyin</Button></Link>
      </div>
      <Footer/>
    </div>
  );

  const trust   = getTrustInfo(job.poster_trust_score ?? 20);
  const isBad   = (job.poster_trust_score ?? 20) < 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Header/>
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1"/> Dib u Laabo
          </Link>

          {/* Suspicious poster alert */}
          {isBad && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
              <Shield className="w-5 h-5 text-red-600 shrink-0 mt-0.5"/>
              <div><span className="font-bold">⚠️ Digniin: </span>Qofka daabicay shaqadan waxaa laga shakiyaa. Ha u dirin lacag kasta.</div>
            </div>
          )}

          {/* Scam tips strip */}
          <div className="scam-banner mb-6">
            <span className="text-amber-600 shrink-0">🛡</span>
            <p className="text-xs">{SCAM_TIPS[0]}. {SCAM_TIPS[2]}.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b bg-slate-50/50">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{job.type}</Badge>
                    {job.is_verified && <Badge variant="success" className="flex items-center gap-1">✓ Xaqiijiyey</Badge>}
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${trust.cls}`} title={trust.tip}>
                      <Shield className="w-3 h-3"/> {trust.label}
                    </span>
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                  <p className="text-lg font-medium text-slate-600">{job.company}</p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 min-w-[200px]">
                  {job.contact_whatsapp && (
                    <a href={contactEmployerWA(job.contact_whatsapp, job.title)} target="_blank" rel="noreferrer">
                      <Button variant="whatsapp" className="w-full gap-2">
                        <MessageSquare className="w-4 h-4"/> WhatsApp ku Codso
                      </Button>
                    </a>
                  )}
                  {job.contact_email && (
                    <a href={`mailto:${job.contact_email}?subject=Codsi Shaqo: ${job.title}`}>
                      <Button variant="outline" className="w-full gap-2">
                        <Mail className="w-4 h-4"/> Email Codso
                      </Button>
                    </a>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-green-600 border-green-200 hover:bg-green-50" onClick={() => shareJobWA(job)}>
                      <Share2 className="w-4 h-4"/> Wadaag
                    </Button>
                    {user && (
                      <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-red-500 border-red-200 hover:bg-red-50" onClick={() => setShowRep(true)}>
                        <Flag className="w-4 h-4"/> Sheeg
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200/60">
                {[
                  { icon:MapPin,    text:job.location },
                  { icon:Briefcase, text:job.salary ?? job.type },
                  { icon:Clock,     text:job.status },
                  { icon:Calendar,  text:job.posted_at ? format(new Date(job.posted_at),"MMM d, yyyy") : "N/A" },
                ].map(({ icon:Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon className="w-4 h-4 text-primary/60 shrink-0"/> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-slate-900 mb-4">Faahfaahinta Shaqada</h3>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>

              {/* Safety box */}
              <div className="mt-12 p-5 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
                <h4 className="font-semibold text-amber-900 flex items-center gap-2">
                  <Shield className="w-5 h-5"/> Ammaan iyo Xaqiijin
                </h4>
                {SCAM_TIPS.map((tip,i) => <p key={i} className="text-sm text-amber-800">{tip}</p>)}
                <div className="pt-2 border-t border-amber-200 text-sm font-medium text-amber-900">
                  Ref ID: #{job.id.slice(0,8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>

      <Dialog open={showRep} onOpenChange={setShowRep}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600"><Flag className="w-5 h-5"/> Soo Sheeg Shaqadan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Haddii shaqadan ay khayaano tahay ama macluumaad been ah, fadlan soo sheeg.</p>
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
    </div>
  );
}
