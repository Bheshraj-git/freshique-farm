export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="h-9 w-40 rounded bg-brand-50 animate-pulse mb-8" />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-brand-50 shadow-card p-4 flex gap-4"
            >
              <div className="h-24 w-24 rounded-xl bg-brand-50 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-40 rounded bg-brand-50 animate-pulse" />
                <div className="h-3 w-24 rounded bg-brand-50/70 animate-pulse" />
                <div className="h-8 w-32 rounded-xl bg-brand-50 animate-pulse" />
              </div>
              <div className="h-5 w-20 rounded bg-brand-50 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 h-72 animate-pulse" />
      </div>
    </div>
  );
}