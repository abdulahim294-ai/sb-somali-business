import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Phone,
  Mail,
  LogOut,
  PlusCircle,
  UserCircle2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Bogga Hore" },
  { href: "/jobs", label: "Shaqooyin" },
  { href: "/freelancers", label: "Xirfadlayaal" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();

  // close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const openLogin = () => {
    setAuthMode("login");
    setShowAuth(true);
  };
  const openRegister = () => {
    setAuthMode("register");
    setShowAuth(true);
  };

  async function signOut() {
    await supabase.auth.signOut();
    toast({ title: "Waa laga baxay xisaabta", variant: "success" });
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
        {/* Top utility bar */}
        <div className="hidden md:block bg-primary text-primary-foreground py-2 text-xs font-medium">
          <div className="container-app flex justify-between items-center">
            <span className="font-display tracking-wide">
              Hadal · Shaqo · Horumar 🇸🇴
            </span>
            <div className="flex items-center gap-6">
              <a
                href="https://wa.me/252687076746"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <Phone className="w-3.5 h-3.5" /> +252 68 707 6746
              </a>
              <a
                href="mailto:Somalibusinesssb@gmail.com"
                className="inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <Mail className="w-3.5 h-3.5" /> Somalibusinesssb@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container-app">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
                <span className="text-white font-display font-bold text-lg leading-none">
                  SB
                </span>
              </div>
              <span className="hidden sm:block font-display font-bold text-lg tracking-tight text-slate-900">
                Somali Business
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? location === "/"
                    : location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-slate-700 hover:text-primary hover:bg-slate-50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <Link href="/post-job">
                    <Button size="sm" className="gap-1.5 font-semibold">
                      <PlusCircle className="w-4 h-4" /> Daabac shaqo
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full border border-border bg-white px-2 py-1.5 hover:bg-accent/30 transition-colors">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium max-w-[120px] truncate text-slate-700">
                          {profile?.full_name ?? user.email}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-60">
                      <div className="px-3 py-2.5 border-b border-border/60 mb-1">
                        <div className="font-semibold text-sm text-slate-900 truncate">
                          {profile?.full_name ?? "Isticmaale"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                        {profile && (
                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5">
                            Trust Score · {profile.trust_score}/100
                          </div>
                        )}
                      </div>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/post-job"
                          className="flex items-center gap-2 cursor-pointer w-full"
                        >
                          <PlusCircle className="w-4 h-4" /> Daabac shaqo
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/create-profile"
                          className="flex items-center gap-2 cursor-pointer w-full"
                        >
                          <UserCircle2 className="w-4 h-4" /> Samee profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={signOut}
                        className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Ka bax
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={openLogin}>
                    Soo gal
                  </Button>
                  <Button
                    size="sm"
                    onClick={openRegister}
                    className="font-semibold"
                  >
                    Samee xisaab
                  </Button>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Xir menu-ka" : "Fur menu-ka"}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden border-t border-border/60 bg-background animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? location === "/"
                    : location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2.5 rounded-lg font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-3 border-t border-border/60 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2 mb-1">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-slate-900 truncate">
                          {profile?.full_name ?? "Isticmaale"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <Link href="/post-job">
                      <Button className="w-full gap-2">
                        <PlusCircle className="w-4 h-4" /> Daabac shaqo
                      </Button>
                    </Link>
                    <Link href="/create-profile">
                      <Button variant="outline" className="w-full gap-2">
                        <UserCircle2 className="w-4 h-4" /> Samee profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full gap-2 text-destructive hover:text-destructive"
                      onClick={signOut}
                    >
                      <LogOut className="w-4 h-4" /> Ka bax
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full" onClick={openLogin}>
                      Soo gal
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={openRegister}
                    >
                      Samee xisaab
                    </Button>
                    <Link href="/post-job">
                      <Button variant="ghost" className="w-full gap-2">
                        <Briefcase className="w-4 h-4" /> Daabac shaqo
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-border/60 space-y-2 text-xs text-muted-foreground">
                <a
                  href="https://wa.me/252687076746"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-2 py-1"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" /> +252 68 707 6746
                </a>
                <a
                  href="mailto:Somalibusinesssb@gmail.com"
                  className="flex items-center gap-2 px-2 py-1"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />{" "}
                  Somalibusinesssb@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        defaultMode={authMode}
      />
    </>
  );
}
