export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      <div className="h-10 w-48 mx-auto rounded bg-brand-50 animate-pulse mb-6 md:mb-10" />
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 h-64 animate-pulse" />
          <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 h-40 animate-pulse" />
        </div>
        <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 h-96 animate-pulse" />
      </div>
    </div>
  );
}
