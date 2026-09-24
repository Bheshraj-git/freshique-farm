import ProductCardSkeleton from "@/components/market/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Filter skeleton */}
      <div className="mb-8 h-12 rounded-xl bg-white/60 border border-brand-50 shadow-card animate-pulse" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}