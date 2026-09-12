"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toast: (options: { type: ToastType; message: string; description?: string }) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      type,
      message,
      description,
    }: {
      type: ToastType;
      message: string;
      description?: string;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message, description }]);
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, description?: string) =>
      addToast({ type: "success", message, description }),
    [addToast]
  );

  const error = useCallback(
    (message: string, description?: string) =>
      addToast({ type: "error", message, description }),
    [addToast]
  );

  const info = useCallback(
    (message: string, description?: string) =>
      addToast({ type: "info", message, description }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      {/* Toast Render Viewport */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-lg border backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3 ${
              item.type === "success"
                ? "bg-surface-container-lowest border-emerald-200 text-on-surface"
                : item.type === "error"
                ? "bg-surface-container-lowest border-rose-200 text-on-surface"
                : "bg-surface-container-lowest border-outline-variant/60 text-on-surface"
            }`}
          >
            {item.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            )}
            {item.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            )}
            {item.type === "info" && (
              <Info className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-headline-sm text-body-md font-semibold leading-tight">
                {item.message}
              </p>
              {item.description && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="text-on-surface-variant hover:text-on-surface p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
