export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="h-10 w-48 mx-auto rounded bg-brand-50 animate-pulse mb-10" />
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