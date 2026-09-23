"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function MarketError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Market error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-ink-900 mb-3">
        Something went wrong
      </h1>
      <p className="text-ink-500 mb-6">
        We couldn&apos;t load the market right now. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}