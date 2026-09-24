import { Star, BadgeCheck, Calendar } from "lucide-react";

interface Props {
    productCount: number;
    activeSince: string;
}

export default function FarmerProducerStats({
    productCount,
    activeSince,
}: Props) {
    return (
        <aside className="space-y-5">
            {/* Stats card */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-600 text-white p-6 shadow-float">
                <div className="flex items-center gap-2 mb-4">
                    <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/20">
                        <Star className="h-4 w-4" />
                    </span>
                    <h3 className="text-lg font-bold">Producer Stats</h3>
                </div>

                <div className="text-center py-4">
                    <p className="text-5xl font-extrabold leading-none">
                        {productCount}
                    </p>
                    <p className="text-sm text-brand-100 mt-1.5">Products Listed</p>
                </div>

                <div className="mt-5 rounded-xl bg-white/10 px-4 py-3">
                    <p className="text-[11px] text-brand-100 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        Active Since
                    </p>
                    <p className="text-base font-bold">{activeSince}</p>
                </div>

                <div className="mt-4 rounded-xl bg-white/15 px-4 py-3 flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-brand-100" />
                    <div>
                        <p className="text-sm font-bold">Verified Producer</p>
                        <p className="text-[11px] text-brand-100">
                            Trusted by Freshique
                        </p>
                    </div>
                </div>
            </div>

            {/* Rating card */}
            <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6">
                <p className="text-xs font-semibold text-ink-500 mb-3">
                    Community Rating
                </p>
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-3xl font-extrabold text-ink-900">
                            4.9 <span className="text-base text-ink-500 font-medium">/ 5.0</span>
                        </p>
                        <div className="flex items-center gap-0.5 mt-1.5">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <Star
                                    key={i}
                                    className="h-4 w-4 text-accent-500"
                                    fill="currentColor"
                                    strokeWidth={0}
                                />
                            ))}
                        </div>
                        <p className="text-[11px] text-ink-500 mt-2">
                            Based on sales &amp; feedback
                        </p>
                    </div>
                    <div className="ml-auto grid place-items-center h-14 w-14 rounded-2xl bg-accent-500 text-white">
                        <Star className="h-6 w-6" fill="currentColor" strokeWidth={0} />
                    </div>
                </div>
            </div>
        </aside>
    );
}