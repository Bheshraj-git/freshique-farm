import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function EmptyFavorites() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-white/50 px-6 py-20 text-center">
      <div className="mx-auto grid place-items-center h-20 w-20 rounded-2xl bg-brand-50 text-brand-300 mb-5">
        <Heart className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-bold text-ink-900 mb-2">
        No favorites yet
      </h2>
      <p className="text-sm text-ink-500 mb-6 max-w-sm mx-auto">
        Save fresh farm products you love by tapping the heart on any product
        card. They&apos;ll appear here for quick access.
      </p>
      <Link href="/market">
        <Button>
          Browse Market
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}