export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="rounded-3xl h-56 bg-white/50 animate-pulse" />
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <div className="rounded-2xl h-48 bg-white/50 animate-pulse" />
                    <div className="rounded-2xl h-56 bg-white/50 animate-pulse" />
                </div>
                <div className="space-y-5">
                    <div className="rounded-2xl h-80 bg-white/50 animate-pulse" />
                    <div className="rounded-2xl h-40 bg-white/50 animate-pulse" />
                </div>
            </div>
        </div>
    );
}