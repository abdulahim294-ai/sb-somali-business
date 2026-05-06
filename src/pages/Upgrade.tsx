import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import {
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Crown,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input, FormField, Label } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";
import { PlanBadge } from "@/components/PlanBadge";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { usePlan, useUpgradePlan } from "@/hooks/usePlan";
import { PLAN_MAP, PLANS, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Upgrade() {
  const [, params] = useRoute<{ planId: string }>("/upgrade/:planId");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { planId: currentPlanId } = usePlan();
  const { mutate: upgrade, isPending } = useUpgradePlan();

  const [showAuth, setShowAuth] = useState(false);
  const [step, setStep] = useState<"confirm" | "payment" | "success">(
    "confirm"
  );
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const targetId = (params?.planId as PlanId) || "basic";
  const target = PLAN_MAP[targetId] ?? PLAN_MAP.basic;

  // ── Auth gate
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-10 max-w-md w-full text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
              Soo gal ka hor
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Qorshe u beddel waxaad u baahan tahay xisaab firfircoon.
            </p>
            <Button onClick={() => setShowAuth(true)} className="w-full" size="lg">
              Soo gal / Samee xisaab
            </Button>
          </div>
        </main>
        <Footer />
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} defaultMode="login" />
      </div>
    );
  }

  if (currentPlanId === targetId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-10 max-w-md w-full text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
              Qorshahan ayaad hadda isticmaalaysaa
            </h2>
            <p className="text-muted-foreground mb-6">
              Qorshaha <strong>{target.name}</strong> ayaad hadda ku jirtaa.
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">Dashboard</Button>
              </Link>
              <Link href="/pricing" className="flex-1">
                <Button className="w-full">Eeg qorshooyinka</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-md border border-border/60 p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
              Qorshaha waa la cusbooneysiiyay!
            </h2>
            <p className="text-muted-foreground mb-2">
              Hadda waxaad isticmaalaysaa qorshaha{" "}
              <span className="font-bold text-slate-900">{target.name}</span>.
            </p>
            <div className="my-5 flex justify-center">
              <PlanBadge plan={target} size="md" />
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full">Dashboard</Button>
              </Link>
              <Link href="/post-job" className="flex-1">
                <Button variant="outline" className="w-full">Daabac shaqo</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    upgrade(targetId, {
      onSuccess: () => setStep("success"),
    });
  }

  const PLAN_COLORS: Record<PlanId, string> = {
    free: "bg-slate-100 border-slate-200",
    basic: "bg-primary/5 border-primary/20",
    free_pro: "bg-amber-50 border-amber-200",
    premium: "bg-emerald-50 border-emerald-200",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container-form">
          <PageHeader
            crumbs={[
              { label: "Qiimaha", href: "/pricing" },
              { label: `Kor u qaad → ${target.name}` },
            ]}
            title={`Kor u qaad: ${target.name}`}
            subtitle="Dhammee qaabka hoos ku qoran si aad qorshahaaga u cusbooneysiiso."
          />

          <div className="grid md:grid-cols-5 gap-6">
            {/* Left: Plan summary + features */}
            <div className="md:col-span-2 space-y-4">
              <div className={cn("rounded-2xl border p-5", PLAN_COLORS[target.id])}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Qorshaha la doortay
                    </p>
                    <p className="font-display font-bold text-xl text-slate-900 mt-0.5">
                      {target.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-3xl font-bold text-slate-900">
                      ${target.price}
                    </span>
                    <span className="text-sm text-muted-foreground">/bil</span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {target.features
                    .filter((f) => f.included)
                    .map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {f.text}
                      </li>
                    ))}
                </ul>
              </div>

              {/* Trust signals */}
              <div className="bg-white rounded-xl border border-border/60 p-4 space-y-2.5">
                {[
                  { icon: ShieldCheck, text: "Lacagta ammaan ah — 256-bit SSL" },
                  { icon: Lock, text: "Macluumaadkaaga lacagta waa ammaan" },
                  { icon: CheckCircle2, text: "Ka noqod 7 maalmood gudahood" },
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <t.icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{t.text}</span>
                  </div>
                ))}
              </div>

              {/* Other plans */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Qorshooyinka kale
                </p>
                <div className="space-y-1.5">
                  {PLANS.filter((p) => p.id !== targetId && p.id !== "free").map(
                    (p) => (
                      <Link key={p.id} href={`/upgrade/${p.id}`}>
                        <div className="flex items-center justify-between text-sm px-3 py-2 rounded-xl border border-border/60 bg-white hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                          <span className="font-medium text-slate-700">{p.name}</span>
                          <span className="text-muted-foreground">${p.price}/bil</span>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right: Payment form */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
                {/* Demo notice */}
                <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <span className="font-semibold">Demo mode:</span> Tani waa
                    sawirka interface-ka. Lacag dhabta ah laguma weydiinayo —
                    qorshaha si toos ah ayaa loo cusbooneysiiyaa.
                  </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-5">
                  <FormField label="Magaca kaardhka">
                    <Input
                      placeholder="Aaden Maxamed"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      autoComplete="cc-name"
                    />
                  </FormField>

                  <FormField label="Lambarka kaardhka">
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="1234 5678 9012 3456"
                        value={cardNum}
                        onChange={(e) =>
                          setCardNum(
                            e.target.value
                              .replace(/\D/g, "")
                              .replace(/(\d{4})/g, "$1 ")
                              .trim()
                              .slice(0, 19)
                          )
                        }
                        autoComplete="cc-number"
                        inputMode="numeric"
                      />
                    </div>
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Taariikhda dhammaadka">
                      <Input
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "");
                          setExpiry(v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2, 4)}` : v);
                        }}
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        maxLength={5}
                      />
                    </FormField>
                    <FormField label="CVV">
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          placeholder="123"
                          type="password"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                          }
                          autoComplete="cc-csc"
                          inputMode="numeric"
                        />
                      </div>
                    </FormField>
                  </div>

                  <div className="pt-1 border-t border-border/60">
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-muted-foreground">Wadarta</span>
                      <span className="font-bold text-slate-900 text-lg">
                        ${target.price} / bil
                      </span>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold gap-2"
                      loading={isPending}
                    >
                      <Lock className="w-4 h-4" />
                      Bixi ${target.price} — Kor u qaad {target.name}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      Biximaynta, waxaad ogolaanaysaa shuruudaha adeegga. Ka
                      noqod 7 maalmood gudahood la xaqiijiyay.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
