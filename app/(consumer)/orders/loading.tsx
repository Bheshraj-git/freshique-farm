export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      <div className="flex items-center justify-between gap-4 mb-4 md:mb-8">
        <div className="h-9 w-40 rounded bg-brand-50 animate-pulse" />
      </div>
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