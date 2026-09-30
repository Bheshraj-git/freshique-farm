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
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90",
        !isFooter && "-ml-3 md:-ml-[17px]",
        className
      )}
      aria-label="Freshique Farm home"
    >
      <Image
        src="/logo.png"
        alt="Freshique Farm"
        width={160}
        height={87}
        className={cn(
          "object-contain",
          isFooter
            ? "w-[160px] h-[87px] md:w-[180px] md:h-auto"
            : "w-[120px] h-[65px] md:w-[160px] md:h-[87px]"
        )}
        priority
      />
    </Link>
  );
}
