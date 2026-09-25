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
        width={isFooter ? 240 : 200}
        height={isFooter ? 72 : 60}
        className={cn(
          "w-auto object-contain",
          isFooter ? "h-14 md:h-16" : "h-12 md:h-14"
        )}
        priority
      />
    </Link>
  );
}
