export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left skeleton */}
        <aside className="space-y-5">
          {/* Identity card skeleton */}
          <div className="rounded-2xl bg-white border border-brand-50 shadow-card overflow-hidden">
            <div className="h-20 bg-brand-100 animate-pulse" />
            <div className="px-5 pb-5 -mt-10">
              <div className="h-20 w-20 rounded-2xl bg-brand-50 ring-4 ring-white shadow-card animate-pulse" />
              <div className="mt-3 h-5 w-32 rounded bg-brand-50 animate-pulse" />
              <div className="mt-2 h-4 w-40 rounded bg-brand-50/70 animate-pulse" />
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="rounded-2xl bg-white border border-brand-50 shadow-card overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-4 border-b border-brand-50 last:border-b-0"
              >
                <div className="h-9 w-9 rounded-lg bg-brand-50 animate-pulse" />
                <div className="flex-1 h-4 rounded bg-brand-50/70 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Details skeleton */}
          <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-5">
            <div className="h-3 w-16 rounded bg-brand-50 animate-pulse mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-4 w-4 rounded bg-brand-50 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3 w-12 rounded bg-brand-50/70 animate-pulse mb-1" />
                    <div className="h-4 w-24 rounded bg-brand-50 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right skeleton */}
        <main>
          <div className="h-8 w-48 rounded bg-brand-50 animate-pulse mb-6" />
          <div className="rounded-2xl border-2 border-dashed border-brand-100 bg-white/50 h-72 animate-pulse" />
        </main>
      </div>
    </div>
  );
}