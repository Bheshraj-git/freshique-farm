"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import MarketFilters from "./MarketFilters";
import { cn } from "@/lib/utils";

interface Props {
  cities: string[];
  categories: { id: string; name: string; slug: string }[];
}

export default function MarketFiltersMobile({ cities, categories }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-700 shadow-card"
        aria-expanded={open}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="mt-3">
          <MarketFilters cities={cities} categories={categories} />
        </div>
      )}
    </div>
  );
}