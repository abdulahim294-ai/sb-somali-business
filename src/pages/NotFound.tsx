import { Link } from "wouter";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="text-7xl mb-6">🔍</div>
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">404 — Bogga La Ma Helin</h1>
      <p className="text-muted-foreground mb-8">Boggan ma jiro ama waa la tirtiray.</p>
      <Link href="/"><Button size="lg">Bogga Hore</Button></Link>
    </div>
  );
}
