import { Link } from "wouter";
import { Mail, Phone, MapPin, ShieldCheck, Heart, Crown } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border/60 mt-auto">
      <div className="container-app py-12 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
                <span className="text-white font-display font-bold">SB</span>
              </div>
              <span className="font-display font-bold text-lg text-slate-900">
                Somali Business
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Buundada isku xirta ganacsatada iyo xirfadlayaasha Soomaaliyeed.
              Hadal · Shaqo · Horumar.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-slate-900 mb-4 uppercase tracking-wider">
              Bogagga
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/jobs",           label: "Shaqooyin" },
                { href: "/freelancers",    label: "Xirfadlayaal" },
                { href: "/post-job",       label: "Daabac shaqo" },
                { href: "/create-profile", label: "Samee profile" },
                { href: "/pricing",        label: "Qiimaha" },
                { href: "/dashboard",      label: "Dashboard" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-slate-900 mb-4 uppercase tracking-wider">
              Xiriir
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="https://wa.me/252687076746"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  +252 68 707 6746
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="mailto:Somalibusinesssb@gmail.com"
                  className="hover:text-primary transition-colors break-all"
                >
                  Somalibusinesssb@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0" /> Muqdisho,
                Soomaaliya
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-slate-900 mb-4 uppercase tracking-wider">
              Ammaan & Aamin
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Shaqooyin la xaqiijiyay khayaanada ka hor</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Heart className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Adeeg bilaash ah — lacag uma baahna</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Crown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Qorshooyinka Premium
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} SB Somali Business. Dhammaan
            xuquuqaha way xifnaan.
          </p>
          <p className="flex items-center gap-1.5">
            La sameeyay <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Soomaaliya
          </p>
        </div>
      </div>
    </footer>
  );
}
