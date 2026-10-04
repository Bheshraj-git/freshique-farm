export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="h-9 w-9 rounded-lg bg-brand-50 animate-pulse" />
        <div className="h-8 w-56 rounded bg-brand-50 animate-pulse" />
      </div>
      <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 mb-6 h-32 animate-pulse" />
      <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 mb-6 h-64 animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 h-40 animate-pulse" />
        <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 h-40 animate-pulse" />
      </div>
    </div>
  );
}