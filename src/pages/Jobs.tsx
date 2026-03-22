import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useJobs } from "@/hooks/useJobs";
import { Search, MapPin, SlidersHorizontal, X, ShieldCheck } from "lucide-react";
import { LOCATIONS, JOB_TYPES } from "@/utils/helpers";
import { SCAM_TIPS } from "@/utils/trustScore";

export default function Jobs() {
  const [search,   setSearch]   = useState("");
  const [location, setLocation] = useState("");
  const [type,     setType]     = useState("");
  const [showTip,  setShowTip]  = useState(true);
  const { data: jobs, isLoading } = useJobs({ search, location, type });
  const hasFilters = !!(search || location || type);

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Header/>
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">Hel Shaqadaada Xigta</h1>
            <p className="text-muted-foreground">Shaqooyinka active-ka ah ee la hubiyey</p>
          </div>

          {showTip && (
            <div className="scam-banner mb-6">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600"/>
              <div className="flex-1 text-sm">
                <span className="font-semibold">Digniin: </span>{SCAM_TIPS[0]}. {SCAM_TIPS[2]}.
              </div>
              <button onClick={() => setShowTip(false)} className="text-amber-400 hover:text-amber-600 shrink-0">
                <X className="w-4 h-4"/>
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                <Input placeholder="Raadi shaqo, shirkad..." className="pl-9 h-11 bg-slate-50 border-slate-200"
                  value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
              <Select value={location||"all"} onValueChange={v => setLocation(v === "all" ? "" : v)}>
                <SelectTrigger className="h-11 w-full md:w-48 bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground"/><SelectValue placeholder="Dhammaan"/></div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Dhammaan Meelaaha</SelectItem>
                  {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={type||"all"} onValueChange={v => setType(v === "all" ? "" : v)}>
                <SelectTrigger className="h-11 w-full md:w-44 bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-muted-foreground"/><SelectValue placeholder="Nooca"/></div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Dhammaan Noocyada</SelectItem>
                  {JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setLocation(""); setType(""); }} className="gap-1.5 text-muted-foreground shrink-0">
                  <X className="w-4 h-4"/> Nadiifi
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl"/>)}</div>
          ) : !jobs?.length ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-slate-900 text-lg">Shaqo la ma helin</h3>
              <p className="text-muted-foreground mt-2 mb-6">{hasFilters ? "Isku day filter kala duwan." : "Haddeer shaqo ma jirto."}</p>
              {hasFilters && <Button variant="outline" onClick={() => { setSearch(""); setLocation(""); setType(""); }}>Nadiifi Filtarrada</Button>}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">{jobs.length} shaqo ayaa la helay</p>
              <div className="space-y-4">{jobs.map(j => <JobCard key={j.id} job={j}/>)}</div>
            </>
          )}
        </div>
      </main>
      <Footer/>
    </div>
  );
}
