import { cn } from "@/lib/utils";

type Tone = "brand" | "accent" | "success" | "warn" | "danger" | "neutral";
type Size = "sm" | "md";

interface BadgeProps {
  tone?: Tone;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

const tones: Record<Tone, string> = {
  brand:   "bg-brand-100 text-brand-800",
  accent:  "bg-accent-100 text-accent-700",
  success: "bg-emerald-100 text-emerald-800",
  warn:    "bg-amber-100 text-amber-800",
  danger:  "bg-danger-500/10 text-danger-600",
  neutral: "bg-ink-300/40 text-ink-700",
};

const sizes: Record<Size, string> = {
  sm: "text-[11px] px-2.5 py-0.5",
  md: "text-xs px-3 py-1",
};

export default function Badge({
  tone = "brand",
  size = "sm",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full whitespace-nowrap",
        tones[tone],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}