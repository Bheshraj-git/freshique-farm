import Image from "next/image";
import { Mail } from "lucide-react";
import FarmerBannerPattern from "./FarmerBannerPattern";

interface Props {
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export default function ProfileIdentityCard({
  fullName,
  email,
  avatarUrl,
}: Props) {
  const initials =
    fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="rounded-2xl bg-white border border-brand-50 shadow-card overflow-hidden">
      {/* Green banner */}
      <div className="relative h-20 bg-gradient-to-br from-brand-500 to-brand-700">
        <FarmerBannerPattern />
      </div>

      {/* Avatar overlapping banner */}
      <div className="px-5 pb-5 -mt-10">
        <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-brand-50 ring-4 ring-white shadow-card">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="grid place-items-center h-full w-full text-2xl font-extrabold text-brand-700 bg-brand-100">
              {initials}
            </span>
          )}
        </div>

        <p className="mt-3 text-lg font-bold text-ink-900 truncate">
          {fullName}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-500 truncate">
          <Mail className="h-3.5 w-3.5 flex-shrink-0 text-brand-600" />
          {email}
        </p>
      </div>
    </div>
  );
}   