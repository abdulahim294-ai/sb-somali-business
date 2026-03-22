import { Link } from "wouter";
import { Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">SB</span>
              </div>
              <span className="font-display font-bold text-lg">Somali Business</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Buundada isku xirta Ganacsatada iyo Xirfadlayaasha Soomaaliyeed. Hadal, Shaqo, Horumar.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900">Xiriiriyaha</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/jobs"          className="text-muted-foreground hover:text-primary transition-colors">Shaqooyin</Link></li>
              <li><Link href="/freelancers"   className="text-muted-foreground hover:text-primary transition-colors">Xirfadlayaal</Link></li>
              <li><Link href="/post-job"      className="text-muted-foreground hover:text-primary transition-colors">Shaqo Daabac</Link></li>
              <li><Link href="/create-profile" className="text-muted-foreground hover:text-primary transition-colors">Profile Samee</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900">Xiriir</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0"/>
                <a href="https://wa.me/252687076746" className="hover:underline">+252 68 707 6746</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0"/>
                <a href="mailto:Somalibusinesssb@gmail.com" className="hover:underline">Somalibusinesssb@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0"/> Mogadishu, Somalia
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-slate-900">Ammaan & Aamin</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5"/>
                <span>Shaqooyin la hubiyey khayaanta ka hor</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Heart className="w-4 h-4 text-primary shrink-0 mt-0.5"/>
                <span>Bilaash 100% — lacag uma baahna</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SB Somali Business. Dhammaan xuquuqyadu way xidantahay.</p>
        </div>
      </div>
    </footer>
  );
}
