export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-brand-50 shadow-card overflow-hidden">
      <div className="aspect-square bg-brand-50/50 animate-pulse" />
      <div className="p-4">
        <div className="h-5 w-3/4 rounded bg-brand-50/70 animate-pulse" />
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="space-y-1.5">
            <div className="h-5 w-20 rounded bg-brand-50 animate-pulse" />
            <div className="h-3 w-14 rounded bg-brand-50/60 animate-pulse" />
          </div>
          <div className="h-8 w-16 rounded-xl bg-brand-50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}