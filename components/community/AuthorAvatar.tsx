import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import type { PostAuthor } from "@/lib/queries/community";

interface Props {
    author: PostAuthor;
    size?: "sm" | "md";
    timestamp?: string;
}

export default function AuthorAvatar({
    author,
    size = "md",
    timestamp,
}: Props) {
    const initials =
        author.full_name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U";

    const dims = size === "sm" ? "h-8 w-8" : "h-10 w-10";
    const text = size === "sm" ? "text-xs" : "text-sm";
    const nameText = size === "sm" ? "text-sm" : "text-base";

    return (
        <div className="flex items-center gap-3 min-w-0">
            <div
                className={`relative ${dims} rounded-full overflow-hidden bg-brand-100 ring-2 ring-brand-50 shrink-0`}
            >
                {author.avatar_url ? (
                    <Image
                        src={author.avatar_url}
                        alt={author.full_name}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <span className={`grid place-items-center h-full w-full font-bold text-brand-700 ${text}`}>
                        {initials}
                    </span>
                )}
            </div>
            <div className="min-w-0 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className={`font-bold text-ink-900 truncate ${nameText}`}>
                    {author.full_name}
                </p>
                {author.role === "farmer" && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold px-2 py-0.5">
                        <BadgeCheck className="h-2.5 w-2.5" />
                        Farmer
                    </span>
                )}
                {timestamp && (
                    <span className="text-xs text-ink-500">
                        · {timestamp}
                    </span>
                )}
            </div>
        </div>
    );
}