"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
  duration: number;
}

type PushFn = (tone: ToastTone, message: string, duration?: number) => void;

interface ToastContextValue {
  toasts: Toast[];
  push: PushFn;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Module-level bridge so non-React code (server actions, event handlers
 * outside the tree, etc.) can call `toast.success(...)`.
 * Set by <ToastProvider /> on mount.
 */
let globalPush: PushFn | null = null;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const push = useCallback<PushFn>(
    (tone, message, duration = 3500) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((s) => [...s, { id, tone, message, duration }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  // Register the bridge while the provider is mounted
  useEffect(() => {
    globalPush = push;
    return () => {
      if (globalPush === push) globalPush = null;
    };
  }, [push]);

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/**
 * Global API. Safe to call from anywhere in the client bundle.
 * If no provider is mounted yet (e.g., during SSR or before first render),
 * the call is a no-op and a warning is logged.
 */
export const toast = {
  success: (msg: string, duration?: number) =>
    callGlobal("success", msg, duration),
  error: (msg: string, duration?: number) => callGlobal("error", msg, duration),
  info: (msg: string, duration?: number) => callGlobal("info", msg, duration),
};

function callGlobal(tone: ToastTone, msg: string, duration?: number) {
  if (!globalPush) {
    // Provider not mounted yet — usually happens during SSR or very early init.
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[toast.${tone}] called before <ToastProvider /> mounted — message dropped: "${msg}"`
      );
    }
    return;
  }
  globalPush(tone, msg, duration);
}