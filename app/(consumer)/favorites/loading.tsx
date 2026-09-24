import ProductCardSkeleton from "@/components/market/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="h-9 w-48 rounded bg-brand-50 animate-pulse" />
        <div className="h-6 w-20 rounded-full bg-brand-50 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}