"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, hint, className, id, ...rest }, ref) => {
    const inputId = id || rest.name || `input-${Math.random().toString(36).slice(2, 8)}`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-ink-900">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-600">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl border bg-white/70 px-4 py-3 text-ink-900",
              "placeholder:text-ink-500 transition",
              "focus:border-brand-500 focus:bg-white focus:outline-none",
              Icon && "pl-11",
              error ? "border-danger-500 focus:border-danger-500" : "border-ink-300",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />
        </div>

        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-danger-600 font-medium">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;