export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-brand-50 shadow-card overflow-hidden">
      <div className="aspect-square bg-brand-50 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-brand-50 animate-pulse" />
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1 space-y-1.5">
            <div className="h-5 w-20 rounded bg-brand-50 animate-pulse" />
            <div className="h-3 w-16 rounded bg-brand-50/70 animate-pulse" />
          </div>
          <div className="h-8 w-16 rounded-xl bg-brand-50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}