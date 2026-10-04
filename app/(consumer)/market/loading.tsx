import ProductCardSkeleton from "@/components/market/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      {/* Filter skeleton */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-3">
        <div className="h-11 sm:h-12 flex-1 sm:max-w-md rounded-xl bg-white/80 border border-brand-50 shadow-card animate-pulse" />
        <div className="hidden sm:flex gap-3">
          <div className="h-12 w-32 rounded-xl bg-white/80 border border-brand-50 shadow-card animate-pulse" />
          <div className="h-12 w-36 rounded-xl bg-white/80 border border-brand-50 shadow-card animate-pulse" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}