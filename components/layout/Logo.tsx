import Link from "next/link";
import Image from "next/image";
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
      className={cn("inline-flex items-center transition-opacity hover:opacity-90", className)}
      aria-label="Freshique Farm home"
    >
      <Image
        src="/logo.png"
        alt="Freshique Farm"
        width={isFooter ? 280 : 250}
        height={isFooter ? 86 : 76}
        className={cn(
          "w-auto object-contain",
          isFooter ? "h-16 md:h-18" : "h-9 md:h-16"
        )}
        priority
      />
    </Link>
  );
}
