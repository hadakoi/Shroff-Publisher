"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const LOGOUT_KEY = "shroff_pending_toast";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  // Pick up any toast queued before a page reload (e.g. logout redirect)
  useEffect(() => {
    const pending = sessionStorage.getItem(LOGOUT_KEY);
    if (pending) {
      sessionStorage.removeItem(LOGOUT_KEY);
      showToast(pending, "info");
    }
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[9999] flex flex-col gap-2 pointer-events-none sm:items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full sm:w-auto sm:max-w-sm flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border animate-slide-in
              ${toast.type === "success"
                ? "bg-white border-emerald-100 text-slate-800"
                : "bg-white border-slate-100 text-slate-800"
              }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0
              ${toast.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              <IconCheck size={13} stroke={2.5} />
            </span>
            {toast.message}
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-1 text-slate-300 hover:text-slate-500 transition-colors"
              aria-label="Dismiss"
            >
              <IconX size={13} stroke={2} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// Called before logout redirect so the toast survives the page reload
export function queueToast(message: string) {
  sessionStorage.setItem(LOGOUT_KEY, message);
}
