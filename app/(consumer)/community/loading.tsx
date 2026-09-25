export default function Loading() {
    return (
        <div className="mx-auto max-w-2xl px-6 py-6">
            <div className="h-9 w-40 rounded bg-brand-50 animate-pulse mb-6" />
            <div className="rounded-2xl bg-white border border-brand-50 shadow-card h-32 animate-pulse mb-6" />

            <div className="space-y-5">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl bg-white border border-brand-50 shadow-card p-5 space-y-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-brand-50 animate-pulse" />
                            <div className="space-y-1.5">
                                <div className="h-4 w-32 rounded bg-brand-50 animate-pulse" />
                                <div className="h-3 w-20 rounded bg-brand-50/70 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-4 w-full rounded bg-brand-50/70 animate-pulse" />
                        <div className="h-4 w-3/4 rounded bg-brand-50/70 animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}