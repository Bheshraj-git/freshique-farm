export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="h-9 w-56 rounded bg-brand-50 animate-pulse mb-6" />
      <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 mb-6 h-32 animate-pulse" />
      <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 mb-6 h-64 animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 h-40 animate-pulse" />
        <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 h-40 animate-pulse" />
      </div>
    </div>
  );
}