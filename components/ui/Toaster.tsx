"use client";

import { CircleCheck, CircleX, Info, X } from "lucide-react";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const iconMap = {
  success: CircleCheck,
  error: CircleX,
  info: Info,
};

const toneMap = {
  success: "bg-white border-brand-200 text-brand-800",
  error: "bg-white border-danger-500/30 text-danger-600",
  info: "bg-white border-ink-300 text-ink-700",
};

export default function Toaster() {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const Icon = iconMap[t.tone];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border shadow-float px-4 py-3 text-sm font-medium animate-toast-in",
              toneMap[t.tone]
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-ink-500 hover:text-ink-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}