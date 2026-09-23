import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "navbar" | "footer";
  className?: string;
}

export default function Logo({ variant = "navbar", className }: LogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 group", className)}
      aria-label="Freshique Farm home"
    >
      {/* Circular leaf emblem — placeholder until real asset is provided */}
      <span
        className={cn(
          "relative grid place-items-center rounded-full bg-brand-50 border-2 border-brand-700",
          isFooter ? "h-12 w-12" : "h-11 w-11"
        )}
      >
        <span className="text-brand-700 text-xl font-black leading-none">🌿</span>
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-extrabold tracking-tight text-brand-800",
            isFooter ? "text-lg" : "text-base"
          )}
        >
          FRESHIQUE
        </span>
        <span
          className={cn(
            "font-extrabold tracking-tight text-brand-800",
            isFooter ? "text-lg" : "text-base"
          )}
        >
          FARM
        </span>
      </span>
    </Link>
  );
}
