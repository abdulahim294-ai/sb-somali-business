import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Phone, Mail, LogOut, BookmarkIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

export function Header() {
  const [open,     setOpen]     = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login"|"register">("login");
  const { user, profile }       = useAuth();
  const { toast }               = useToast();

  const openLogin    = () => { setAuthMode("login");    setShowAuth(true); };
  const openRegister = () => { setAuthMode("register"); setShowAuth(true); };

  async function signOut() {
    await supabase.auth.signOut();
    toast({ title:"Waa laga baxay", variant:"success" });
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? "U");

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        {/* Top utility bar */}
        <div className="hidden md:block bg-primary text-primary-foreground py-2 text-sm font-medium">
          <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
            <span className="font-display">Hadal, Shaqo, Horumar 🇸🇴</span>
            <div className="flex gap-6">
              <a href="https://wa.me/252687076746" target="_blank" rel="noreferrer" className="flex items-center hover:opacity-80 gap-1.5">
                <Phone className="w-3 h-3"/> +252 68 707 6746
              </a>
              <a href="mailto:Somalibusinesssb@gmail.com" className="flex items-center hover:opacity-80 gap-1.5">
                <Mail className="w-3 h-3"/> Somalibusinesssb@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <span className="text-white font-display font-bold text-xl">SB</span>
              </div>
              <span className="hidden sm:block font-display font-bold text-xl tracking-tight">Somali Business</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/"            className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
              <Link href="/jobs"        className="text-sm font-medium hover:text-primary transition-colors">Shaqooyin</Link>
              <Link href="/freelancers" className="text-sm font-medium hover:text-primary transition-colors">Xirfadlayaal</Link>
              <div className="h-5 w-px bg-border"/>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/post-job">
                    <Button size="sm" className="gap-1.5 font-semibold shadow-md">
                      <PlusCircle className="w-4 h-4"/> Post Shaqo
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full border border-border px-2.5 py-1.5 hover:bg-accent transition-colors">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium max-w-[110px] truncate">
                          {profile?.full_name ?? user.email}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <div className="px-3 py-2 text-xs text-muted-foreground border-b mb-1">
                        <div className="font-semibold text-foreground truncate">{profile?.full_name ?? "Isticmaale"}</div>
                        <div className="truncate opacity-70">{user.email}</div>
                        {profile && (
                          <div className="mt-1.5 text-[11px] font-semibold text-primary">
                            Trust Score: {profile.trust_score}/100
                          </div>
                        )}
                      </div>
                      <DropdownMenuItem asChild>
                        <Link href="/my-jobs" className="flex items-center gap-2 cursor-pointer w-full">
                          <BookmarkIcon className="w-4 h-4"/> Shaqooyinkeyga
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive gap-2 cursor-pointer">
                        <LogOut className="w-4 h-4"/> Ka Bax
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={openLogin}>Gal</Button>
                  <Button size="sm" onClick={openRegister} className="font-semibold shadow-md">Xisaab Fur</Button>
                </div>
              )}
            </nav>

            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden border-t bg-background p-4 space-y-3 shadow-xl">
            <Link href="/"            onClick={() => setOpen(false)} className="block py-2 font-medium">Home</Link>
            <Link href="/jobs"        onClick={() => setOpen(false)} className="block py-2 font-medium">Shaqooyin</Link>
            <Link href="/freelancers" onClick={() => setOpen(false)} className="block py-2 font-medium">Xirfadlayaal</Link>
            <div className="border-t pt-3 space-y-2">
              {user ? (
                <>
                  <Link href="/post-job" onClick={() => setOpen(false)}>
                    <Button className="w-full gap-2"><PlusCircle className="w-4 h-4"/> Post Shaqo</Button>
                  </Link>
                  <Button variant="outline" className="w-full gap-2" onClick={() => { signOut(); setOpen(false); }}>
                    <LogOut className="w-4 h-4"/> Ka Bax
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full" onClick={() => { openLogin(); setOpen(false); }}>Gal</Button>
                  <Button variant="outline" className="w-full" onClick={() => { openRegister(); setOpen(false); }}>Xisaab Fur</Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} defaultMode={authMode}/>
    </>
  );
}
