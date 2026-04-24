import { MapPin, Star, BadgeCheck, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Freelancer } from "@/lib/supabase";

export function FreelancerCard({ freelancer: f }: { freelancer: Freelancer }) {
  const initials = f.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const waLink = f.contact_whatsapp
    ? `https://wa.me/${f.contact_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Salaan! Waxaan ku arkay SB Somali Business. ${f.role} ayaan u baahanahay.`
      )}`
    : null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm card-hover flex flex-col items-center text-center h-full">
      <div className="relative mb-4">
        <Avatar className="w-20 h-20 border-4 border-primary/10">
          <AvatarFallback className="bg-primary/5 text-primary font-bold font-display text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        {f.is_verified && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <BadgeCheck className="w-6 h-6 text-primary" />
          </div>
        )}
        {f.is_available && (
          <span
            className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"
            title="Diyaar"
            aria-label="Diyaar"
          />
        )}
      </div>

      <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
        {f.name}
      </h3>
      <p className="text-primary font-medium text-sm mt-0.5 mb-2">{f.role}</p>

      <div className="flex items-center gap-1 mb-3">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span className="font-bold text-slate-700 text-sm">{f.rating}</span>
      </div>

      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <MapPin className="w-3.5 h-3.5 mr-1.5" /> {f.location}
      </div>

      {f.bio && (
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {f.bio}
        </p>
      )}

      {f.skills && f.skills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mb-5">
          {f.skills.slice(0, 4).map((s, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md bg-slate-50 text-xs font-medium text-slate-600 border border-slate-200/80"
            >
              {s}
            </span>
          ))}
          {f.skills.length > 4 && (
            <span className="px-2.5 py-1 rounded-md bg-slate-50 text-xs font-medium text-slate-500 border border-slate-200/80">
              +{f.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {waLink ? (
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="mt-auto w-full"
        >
          <button className="w-full py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-200 inline-flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" /> La xiriir
          </button>
        </a>
      ) : (
        <div className="mt-auto w-full py-2.5 text-center text-xs text-muted-foreground">
          Xog xiriir ma jirto
        </div>
      )}
    </div>
  );
}
