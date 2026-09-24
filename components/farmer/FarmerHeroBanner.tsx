import Image from "next/image";
import { Calendar, Package, BadgeCheck } from "lucide-react";

interface Props {
    fullName: string;
    avatarUrl: string | null;
    joinedLabel: string;
    productCount: number;
}

export default function FarmerHeroBanner({
    fullName,
    avatarUrl,
    joinedLabel,
    productCount,
}: Props) {
    const initials =
        fullName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "F";

    return (
        <section className="relative rounded-3xl overflow-hidden shadow-card bg-gradient-to-br from-sky-500/40 via-brand-500/50 to-brand-700/60 border border-white/40">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/15 blur-2xl" />

            <div className="relative p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
                {/* Avatar */}
                <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden ring-4 ring-white/70 shadow-float bg-white shrink-0 mx-auto md:mx-0">
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt={fullName}
                            fill
                            sizes="128px"
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <span className="grid place-items-center h-full w-full text-3xl font-extrabold text-brand-700 bg-brand-100">
                            {initials}
                        </span>
                    )}
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-brand-600 text-white text-[10px] font-bold px-2.5 py-0.5 shadow">
                        <BadgeCheck className="h-3 w-3" />
                        Active
                    </span>
                </div>

                {/* Text */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-sm">
                        {fullName}
                    </h1>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                        <BadgeCheck className="h-4 w-4" />
                        Certified Freshique Producer
                    </p>

                    {/* Stat pills */}
                    <div className="mt-5 flex flex-wrap gap-3 justify-center md:justify-start">
                        <div className="rounded-2xl bg-white px-5 py-3 shadow-card">
                            <p className="text-xs text-ink-500 flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-brand-600" />
                                Member Since
                            </p>
                            <p className="text-base font-bold text-ink-900 mt-0.5">
                                {joinedLabel}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white px-5 py-3 shadow-card">
                            <p className="text-xs text-ink-500 flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5 text-brand-600" />
                                Products Listed
                            </p>
                            <p className="text-base font-bold text-ink-900 mt-0.5">
                                {productCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}