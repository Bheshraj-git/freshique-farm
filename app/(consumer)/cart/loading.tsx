export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-28 md:pb-12 overflow-x-hidden">
      <div className="h-9 w-40 rounded bg-brand-50 animate-pulse mb-4 md:mb-8" />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-brand-50 shadow-card p-3 sm:p-4 flex gap-3 sm:gap-4 items-center"
            >
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl bg-brand-50 animate-pulse shrink-0" />
              <div className="flex-1 min-w-0 space-y-2.5 sm:space-y-3">
                <div className="h-5 w-3/4 max-w-[160px] rounded bg-brand-50 animate-pulse" />
                <div className="h-3.5 w-1/2 max-w-[96px] rounded bg-brand-50/70 animate-pulse" />
                <div className="h-8 w-24 sm:w-32 rounded-xl bg-brand-50 animate-pulse" />
              </div>
              <div className="h-5 w-16 sm:w-20 rounded bg-brand-50 animate-pulse shrink-0" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 h-72 animate-pulse" />
      </div>
    </div>
  );
}