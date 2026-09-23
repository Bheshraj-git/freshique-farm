"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/app/(favorites)/actions";
import { useUser } from "@/lib/hooks/useUser";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface Props {
  productId: string;
  initialFavorited: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function FavoriteButton({
  productId,
  initialFavorited,
  size = "md",
  className,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { push } = useToast();

  // Optimistic local state
  const [favorited, setFavorited] = useState(initialFavorited);
  const [, startTransition] = useTransition();

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Not signed in → toast + redirect
    if (!user) {
      push("info", "Please log in to save items");
      setTimeout(() => {
        const next = encodeURIComponent(pathname);
        router.push(`/login?next=${next}`);
      }, 700);
      return;
    }

    const wasFavorited = favorited;
    const next = !wasFavorited;

    // Optimistic update
    setFavorited(next);

    const result = await toggleFavoriteAction(productId);

    if (!result.ok) {
      // Revert on failure
      setFavorited(wasFavorited);

      if (result.error === "NOT_AUTHENTICATED") {
        push("info", "Please log in to save items");
        setTimeout(() => {
          const nextPath = encodeURIComponent(pathname);
          router.push(`/login?next=${nextPath}`);
        }, 700);
        return;
      }

      push("error", result.error || "Could not update favorite");
      return;
    }

    // Success — revalidate server data silently
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorited ? "Remove from favorites" : "Save for later"}
      aria-pressed={favorited}
      className={cn(
        "grid place-items-center rounded-full bg-white/95 backdrop-blur-sm shadow-soft transition",
        buttonSize,
        favorited
          ? "text-danger-600 hover:bg-white"
          : "text-ink-700 hover:text-danger-600 hover:bg-white",
        className
      )}
    >
      <Heart
        className={cn(iconSize, "transition-transform active:scale-90")}
        strokeWidth={2}
        fill={favorited ? "currentColor" : "none"}
      />
    </button>
  );
}