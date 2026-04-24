import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, Briefcase } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div className="text-7xl mb-4">🔍</div>
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          Khalad 404
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Bogga lama helin
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Boggaagu ma jiro, waa la beddelay, ama waa la tirtiray. Hubi link-ga
          ama dib ugu noqo bogga hore.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="w-4 h-4" /> Bogga hore
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="lg" variant="outline" className="gap-2">
              <Briefcase className="w-4 h-4" /> Eeg shaqooyinka
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
