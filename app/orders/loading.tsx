export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="h-9 w-40 rounded bg-brand-50 animate-pulse mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-brand-50 shadow-card p-5 flex items-center gap-5"
          >
            <div className="h-20 w-20 rounded-xl bg-brand-50 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-24 rounded-full bg-brand-50 animate-pulse" />
              <div className="h-4 w-48 rounded bg-brand-50/70 animate-pulse" />
              <div className="h-3 w-32 rounded bg-brand-50/70 animate-pulse" />
            </div>
            <div className="h-6 w-20 rounded bg-brand-50 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}