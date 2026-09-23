"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  cities: string[];
  categories: { id: string; name: string; slug: string }[];
}

export default function MarketFilters({ cities, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state mirrors URL so typing feels instant
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [min, setMin] = useState(searchParams.get("min") ?? "");
  const [max, setMax] = useState(searchParams.get("max") ?? "");

  // Debounce text search
  useEffect(() => {
    const t = setTimeout(() => {
      applyFilters({ q });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function applyFilters(overrides: Partial<Record<string, string>> = {}) {
    const params = new URLSearchParams();
    const values = { q, city, category, min, max, ...overrides };

    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    startTransition(() => {
      router.push(`/market?${params.toString()}`, { scroll: false });
    });
  }

  function clearAll() {
    setQ("");
    setCity("");
    setCategory("");
    setMin("");
    setMax("");
    startTransition(() => {
      router.push("/market", { scroll: false });
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center",
        isPending && "opacity-70 pointer-events-none"
      )}
    >
      {/* Search */}
      <div className="relative flex-1 lg:max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-600" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-ink-300 bg-white/80 pl-11 pr-4 py-3 text-sm text-ink-900 placeholder:text-ink-500 shadow-card focus:border-brand-500 focus:bg-white focus:outline-none transition"
        />
      </div>

      {/* City */}
      <select
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          applyFilters({ city: e.target.value });
        }}
        className="rounded-xl border border-ink-300 bg-white/80 px-4 py-3 text-sm font-medium text-ink-900 shadow-card focus:border-brand-500 focus:outline-none min-w-[140px]"
      >
        <option value="">All Cities</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          applyFilters({ category: e.target.value });
        }}
        className="rounded-xl border border-ink-300 bg-white/80 px-4 py-3 text-sm font-medium text-ink-900 shadow-card focus:border-brand-500 focus:outline-none min-w-[160px]"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Min / Max */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          onBlur={() => applyFilters({ min })}
          placeholder="Min"
          className="w-20 rounded-xl border border-ink-300 bg-white/80 px-3 py-3 text-sm text-center text-ink-900 placeholder:text-ink-500 shadow-card focus:border-brand-500 focus:outline-none"
        />
        <span className="text-ink-300">—</span>
        <input
          type="number"
          inputMode="numeric"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          onBlur={() => applyFilters({ max })}
          placeholder="Max"
          className="w-20 rounded-xl border border-ink-300 bg-white/80 px-3 py-3 text-sm text-center text-ink-900 placeholder:text-ink-500 shadow-card focus:border-brand-500 focus:outline-none"
        />
      </div>

      {/* Clear All */}
      <button
        type="button"
        onClick={clearAll}
        className="rounded-xl bg-danger-600 px-5 py-3 text-sm font-bold text-white shadow-card hover:bg-danger-500 active:scale-[0.98] transition lg:ml-auto"
      >
        Clear All
      </button>
    </div>
  );
}