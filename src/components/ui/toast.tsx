import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToastState, type ToastVariant } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const STYLES: Record<ToastVariant, string> = {
  default:     "bg-white border-border text-foreground",
  success:     "bg-emerald-50 border-emerald-200 text-emerald-900",
  destructive: "bg-red-50 border-red-200 text-red-900",
  warning:     "bg-amber-50 border-amber-200 text-amber-900",
};

const ICONS: Record<ToastVariant, React.ReactNode> = {
  default:     <Info className="w-4 h-4 text-primary shrink-0"/>,
  success:     <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>,
  destructive: <AlertCircle className="w-4 h-4 text-red-600 shrink-0"/>,
  warning:     <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0"/>,
};

export function Toaster() {
  const { toasts, remove } = useToastState();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-[380px] pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={cn(
          "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg",
          "animate-slide-up",
          STYLES[t.variant ?? "default"]
        )}>
          {ICONS[t.variant ?? "default"]}
          <div className="flex-1 min-w-0">
            {t.title       && <p className="font-semibold text-sm">{t.title}</p>}
            {t.description && <p className="text-xs mt-0.5 opacity-80">{t.description}</p>}
          </div>
          <button onClick={() => remove(t.id)} className="opacity-50 hover:opacity-100 shrink-0">
            <X className="w-4 h-4"/>
          </button>
        </div>
      ))}
    </div>
  );
}
