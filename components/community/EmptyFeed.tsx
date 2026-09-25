import { MessageCircle } from "lucide-react";

export default function EmptyFeed() {
    return (
        <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-white/50 px-6 py-20 text-center">
            <div className="mx-auto grid place-items-center h-20 w-20 rounded-2xl bg-brand-50 text-brand-300 mb-5">
                <MessageCircle className="h-10 w-10" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-ink-900 mb-2">
                No posts yet
            </h2>
            <p className="text-sm text-ink-500 max-w-sm mx-auto">
                Be the first to share something with the Freshique community.
            </p>
        </div>
    );
}