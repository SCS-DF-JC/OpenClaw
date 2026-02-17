"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => {} });

export const useToast = () => useContext(Ctx);

const colors: Record<ToastType, string> = {
  success: "bg-emerald-600/90 border-emerald-500/30",
  error: "bg-red-600/90 border-red-500/30",
  warning: "bg-amber-600/90 border-amber-500/30",
  info: "bg-[#d4a843]/90 border-[#d4a843]/30",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${colors[t.type]} text-white text-sm px-4 py-2.5 rounded-lg shadow-lg border backdrop-blur-sm pointer-events-auto animate-[slideIn_0.2s_ease-out]`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
