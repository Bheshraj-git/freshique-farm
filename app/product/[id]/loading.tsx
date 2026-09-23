export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-16 rounded bg-brand-50 animate-pulse" />
        <div className="h-4 w-4 rounded bg-brand-50 animate-pulse" />
        <div className="h-4 w-20 rounded bg-brand-50 animate-pulse" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl bg-brand-50 animate-pulse" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-16 rounded-xl bg-brand-50 animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="h-9 w-3/4 rounded bg-brand-50 animate-pulse" />
          <div className="h-4 w-40 rounded bg-brand-50/70 animate-pulse" />
          <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 space-y-3">
            <div className="h-12 w-40 rounded bg-brand-50 animate-pulse" />
            <div className="h-6 w-32 rounded-full bg-brand-50 animate-pulse" />
          </div>
          <div className="h-24 rounded-2xl bg-white border border-brand-50 shadow-card animate-pulse" />
          <div className="h-14 rounded-2xl bg-brand-50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}