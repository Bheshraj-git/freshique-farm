"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-card active:scale-[0.98]",
  secondary:
    "bg-white text-brand-800 border border-brand-200 hover:bg-brand-50 shadow-card active:scale-[0.98]",
  accent:
    "bg-accent-500 text-white hover:bg-accent-600 shadow-card active:scale-[0.98]",
  ghost:
    "bg-transparent text-brand-700 hover:bg-brand-50 active:scale-[0.98]",
  danger:
    "bg-danger-600 text-white hover:bg-danger-500 shadow-card active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-4 py-2 gap-1.5 rounded-xl",
  md: "text-sm px-6 py-3 gap-2 rounded-xl",
  lg: "text-base px-8 py-3.5 gap-2 rounded-2xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    className,
    children,
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center font-semibold transition-all duration-200",
    "disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const content = (
    <>
      {loading && <Spinner size="sm" />}
      {children}
    </>
  );

  if ("href" in props && props.href) {
    const { href, target, rel, prefetch } = props;
    return (
      <Link href={href} target={target} rel={rel} prefetch={prefetch} className={classes}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    loading: _l,
    className: _c,
    children: _ch,
    ...rest
  } = props as ButtonAsButton;

  return (
    <button ref={ref} className={classes} disabled={loading || rest.disabled} {...rest}>
      {content}
    </button>
  );
});

Button.displayName = "Button";
export default Button;