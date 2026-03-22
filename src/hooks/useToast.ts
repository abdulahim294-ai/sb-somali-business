import { useState, useCallback } from "react";

export type ToastVariant = "default" | "success" | "destructive" | "warning";
export interface ToastItem { id: string; title?: string; description?: string; variant?: ToastVariant; }

let _dispatch: ((t: Omit<ToastItem,"id">) => void) | null = null;

export function toast(t: Omit<ToastItem,"id">) { _dispatch?.(t); }

export function useToastState() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((t: Omit<ToastItem,"id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { ...t, id }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 4500);
  }, []);

  _dispatch = add;

  const remove = (id: string) => setToasts(p => p.filter(x => x.id !== id));

  return { toasts, remove };
}

export function useToast() {
  return {
    toast: (t: Omit<ToastItem,"id">) => {
      const id = Math.random().toString(36).slice(2);
      const item = { ...t, id };
      // fallback when hook is used inside component
      _dispatch?.(t);
      return item;
    }
  };
}
