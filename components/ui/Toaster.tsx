"use client";
import { useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";
interface Toast { id: string; type: ToastType; title: string; message?: string; }
interface ToastContextType {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // SSR-safe fallback — no-ops
    const noop = () => {};
    return { toast: noop, success: noop, error: noop, warning: noop, info: noop };
  }
  return ctx;
}

const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle, info: Info };
const colors = {
  success: { bg: "#f0fdf4", border: "rgba(22,163,74,0.2)", icon: "#15803d", title: "#14532d" },
  error: { bg: "#fef2f2", border: "rgba(239,68,68,0.2)", icon: "#dc2626", title: "#7f1d1d" },
  warning: { bg: "#fffbeb", border: "rgba(245,158,11,0.2)", icon: "#b45309", title: "#78350f" },
  info: { bg: "rgba(252,250,248,0.95)", border: "rgba(109,33,60,0.15)", icon: "#6D213C", title: "#1A0D12" },
};

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const ctx: ToastContextType = {
    toast,
    success: (title, message) => toast({ type: "success", title, message }),
    error: (title, message) => toast({ type: "error", title, message }),
    warning: (title, message) => toast({ type: "warning", title, message }),
    info: (title, message) => toast({ type: "info", title, message }),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            const c = colors[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                style={{ background: c.bg, border: `1px solid ${c.border}` }}
                className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px] max-w-[360px]"
              >
                <Icon size={16} style={{ color: c.icon, marginTop: 2, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p style={{ color: c.title }} className="text-sm font-semibold leading-tight">{t.title}</p>
                  {t.message && <p className="text-xs text-[#5C4A52] mt-0.5">{t.message}</p>}
                </div>
                <button onClick={() => remove(t.id)} className="text-[#9B8EA0] hover:text-[#5C4A52] transition-colors">
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
