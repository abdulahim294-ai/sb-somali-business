import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FreelancerCard } from "@/components/FreelancerCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFreelancers } from "@/hooks/useFreelancers";
import { Search, MapPin } from "lucide-react";
import { LOCATIONS } from "@/utils/helpers";

export default function Freelancers() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const { data: freelancers, isLoading } = useFreelancers({ search, location });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10 md:py-12">
        <div className="container-app">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Ku shaqaysiiso xirfadle
            </h1>
            <p className="text-muted-foreground">
              Xirfadlayaasha Soomaaliyeed ee diyaar u ah mashruucaaga.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-3 sm:p-4 mb-10 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              <Input
                placeholder="Raadi magac ama xirfad..."
                className="pl-10 bg-slate-50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={location || "all"}
              onValueChange={(v) => setLocation(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-full md:w-52 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Dhammaan meelaha" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Dhammaan meelaha</SelectItem>
                {LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 skeleton" />
              ))}
            </div>
          ) : !freelancers?.length ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border max-w-xl mx-auto">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="font-semibold text-slate-900 text-lg">
                Xirfadlayaal lama helin
              </h3>
              <p className="text-muted-foreground mt-2">
                Isku day ereyo ama meel kale.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {freelancers.length} xirfadle ayaa la helay
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((f) => (
                  <FreelancerCard key={f.id} freelancer={f} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
