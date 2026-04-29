import { Link } from "wouter";
import { Check, X, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { PLANS, COMPARISON_ROWS } from "@/lib/plans";
import { usePlan } from "@/hooks/usePlan";
import { cn } from "@/lib/utils";

const ACCENT = {
  slate: "border-slate-200",
  primary: "border-primary/30",
  emerald: "border-emerald-300",
  amber: "border-amber-300 ring-2 ring-amber-200/60",
} as const;

export default function Pricing() {
  const { planId } = usePlan();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-10 md:py-14">
        <div className="container-app">
          <PageHeader
            crumbs={[{ label: "Qiimaha" }]}
            align="center"
            title="Dooro qorshe ku habboon adiga"
            subtitle="Bilow bilaash. U beddel mid sare goorta aad rabto. Lacagta dib ayaa loo soo celiyaa 7 maalmood gudahood haddii aanad faraxsanayn."
          />

          {/* Plan grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {PLANS.map((p) => {
              const active = planId === p.id;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "relative flex flex-col bg-white rounded-2xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg",
                    ACCENT[p.accent],
                    p.highlight && "shadow-lg shadow-amber-200/30"
                  )}
                >
                  {p.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wider shadow">
                      <Sparkles className="w-3 h-3" /> {p.badge}
                    </span>
                  )}

                  <div className="mb-5">
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.nameSo}
                    </p>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold text-slate-900 tabular-nums">
                        ${p.price}
                      </span>
                      {p.price > 0 && (
                        <span className="text-sm text-muted-foreground">
                          /bil
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {p.tagline}
                    </p>
                  </div>

                  {active ? (
                    <Button
                      className="w-full mb-5"
                      variant="outline"
                      disabled
                    >
                      Qorshahaagu hadda
                    </Button>
                  ) : (
                    <Link
                      href={p.id === "free" ? "/dashboard" : `/upgrade/${p.id}`}
                      className="block mb-5"
                    >
                      <Button
                        className={cn(
                          "w-full font-semibold",
                          p.highlight && "bg-amber-500 hover:bg-amber-600"
                        )}
                        variant={
                          p.id === "free" || p.id === "basic"
                            ? "outline"
                            : "default"
                        }
                      >
                        {p.ctaLabel}
                      </Button>
                    </Link>
                  )}

                  <ul className="space-y-2.5 text-sm">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        {f.included ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={cn(
                            "leading-relaxed",
                            f.included ? "text-slate-700" : "text-slate-400"
                          )}
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Comparison table */}
          <section className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-border/60 bg-slate-50/40">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Isbarbar dhig qorshooyinka
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Eeg waxa ku jira qorshe walba si aad u dooratid mid kuu haboon.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-slate-50/30">
                    <th className="text-left py-4 px-6 font-semibold text-slate-600">
                      Sifada
                    </th>
                    {PLANS.map((p) => (
                      <th
                        key={p.id}
                        className="text-center py-4 px-4 font-semibold text-slate-900 min-w-[120px]"
                      >
                        <div>{p.name}</div>
                        <div className="text-xs font-normal text-muted-foreground">
                          ${p.price}/bil
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr
                      key={row.label}
                      className={cn(
                        "border-b border-border/40 last:border-0",
                        i % 2 === 1 && "bg-slate-50/30"
                      )}
                    >
                      <td className="py-3.5 px-6 text-slate-700">
                        {row.label}
                      </td>
                      {PLANS.map((p) => (
                        <td
                          key={p.id}
                          className="py-3.5 px-4 text-center text-slate-700 tabular-nums"
                        >
                          {row.value(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ-ish */}
          <section className="mt-14 grid md:grid-cols-3 gap-5">
            {[
              {
                q: "Miyaan goor walba beddeli karaa qorshahayga?",
                a: "Haa. Markasta waxaad heli kartaa upgrade ama downgrade. Lacagta intii hadhay si toos ah ayaa loo qiyaasaa.",
              },
              {
                q: "Ammaan ma tahay khidmadda?",
                a: "Lacag bixinta waxaa lagu xiraa Stripe. Macluumaadkaaga lacagta ayaan u khasab nahay inaan kaydino.",
              },
              {
                q: "Maxaa ka jira ka-noqodka?",
                a: "Hawl-galkaaga ka noqo waqti kasta. Waxaad heli doontaa lacag-celin ku xidhan 7 maalmood haddii aadan faraxsanayn.",
              },
            ].map((f) => (
              <div
                key={f.q}
                className="bg-white border border-border/60 rounded-2xl p-5"
              >
                <p className="font-semibold text-slate-900 mb-1.5">{f.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
