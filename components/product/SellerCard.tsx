import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";

interface Props {
  farmerId: string;
  farmerName: string;
  farmerAvatar: string | null;
}

export default function SellerCard({
  farmerId,
  farmerName,
  farmerAvatar,
}: Props) {
  const initials =
    farmerName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "F";

  return (
    <Link
      href={`/farmer/${farmerId}`}
      className="block rounded-2xl bg-white border border-brand-50 shadow-card p-5 hover:shadow-float transition group"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-brand-100 shrink-0">
          {farmerAvatar ? (
            <Image
              src={farmerAvatar}
              alt={farmerName}
              fill
              sizes="56px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="grid place-items-center h-full w-full bg-brand-600 text-white text-sm font-bold">
              {initials}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-wider text-ink-500 uppercase">
            Sold by
          </p>
          <p className="text-base font-bold text-ink-900 truncate">
            {farmerName}
          </p>
          {/* Static 5-star visual — real ratings come in Phase 13 */}
          <div className="mt-1 flex items-center gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 text-accent-500"
                fill="currentColor"
                strokeWidth={0}
              />
            ))}
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-ink-300 group-hover:text-brand-600 transition" />
      </div>
    </Link>
  );
}