"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Award,
  ShieldCheck,
  Warehouse,
  MapPin,
  Package,
  TrendingUp,
  Star,
  Phone,
  Mail,
  Share2,
  Check,
} from "lucide-react";
import { useState } from "react";
import { PublicFarmerProfile } from "@/lib/queries/farmerProfile";

interface Props {
  farmer: PublicFarmerProfile;
}

export default function FarmerHero({ farmer }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${farmer.fullName} - Freshique Farm`,
          text: `Check out ${farmer.fullName}'s organic farm produce on Freshique Farm!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#8C531B] via-[#7B4616] to-[#5C330E] text-white pt-6 pb-14 sm:py-16 md:py-20 shadow-xl">
      {/* Decorative background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with back button & share button */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 hover:text-white transition text-sm font-semibold border border-white/10 shadow-xs"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/90 hover:text-white transition text-xs sm:text-sm font-semibold border border-white/10 shadow-xs"
            title="Share profile"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-200">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Main Grid: Left avatar / badges, Right details & stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Avatar Column */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative inline-block">
              {/* Outer decorative ring */}
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/25 bg-amber-900/40">
                <Image
                  src={
                    farmer.profilePicture &&
                    !farmer.profilePicture.includes("chs5mh6tnxh72cj0p4ej")
                      ? farmer.profilePicture
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          farmer.fullName || "Farmer"
                        )}&background=047857&color=fff&size=200&bold=true`
                  }
                  alt={farmer.fullName}
                  fill
                  sizes="(max-width: 640px) 176px, 208px"
                  priority
                  className="object-cover transform hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              </div>

              {/* "Top Farmer" floating badge */}
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm px-4 sm:px-5 py-1.5 rounded-full shadow-lg shadow-orange-950/40 flex items-center gap-1.5 ring-2 ring-white/80 whitespace-nowrap">
                <Award className="w-4 h-4 text-amber-200" strokeWidth={2.5} />
                <span>Top Farmer</span>
              </div>
            </div>

            {/* Badges beneath avatar */}
            <div className="mt-8 flex items-center justify-center gap-3 w-full max-w-xs">
              <div className="flex-1 bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl py-3 px-3 flex flex-col items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6 text-emerald-300 mb-0.5" strokeWidth={2.2} />
                <span className="text-[11px] sm:text-xs font-semibold text-white/95">
                  Verified
                </span>
              </div>

              <div className="flex-1 bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl py-3 px-3 flex flex-col items-center justify-center shadow-xs">
                <Warehouse className="w-6 h-6 text-amber-200 mb-0.5" strokeWidth={2.2} />
                <span className="text-[11px] sm:text-xs font-semibold text-white/95 capitalize">
                  {farmer.farmType || "Farm"}
                </span>
              </div>
            </div>
          </div>

          {/* Details & Stats Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
                {farmer.fullName}
              </h1>

              <div className="mt-2.5 sm:mt-3 flex items-center justify-center lg:justify-start gap-2 text-base sm:text-lg text-emerald-200 font-medium">
                <MapPin className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>
                  {farmer.location.city}
                  {farmer.location.state ? `, ${farmer.location.state}` : ""}
                </span>
              </div>
            </div>

            {/* 3 Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
              {/* Orders */}
              <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-5 text-center transition-all duration-200">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 mx-auto text-amber-300 mb-1 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-black text-white">
                  {farmer.stats.totalOrders}
                </p>
                <p className="text-[10px] sm:text-xs text-white/80 font-medium uppercase tracking-wider">
                  Orders
                </p>
              </div>

              {/* Growth */}
              <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-5 text-center transition-all duration-200">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 mx-auto text-amber-300 mb-1 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-black text-white">
                  {farmer.stats.monthlyGrowth}%
                </p>
                <p className="text-[10px] sm:text-xs text-white/80 font-medium uppercase tracking-wider">
                  Growth
                </p>
              </div>

              {/* Rating */}
              <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-5 text-center transition-all duration-200">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 mx-auto text-yellow-300 fill-yellow-300 mb-1 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-black text-white">
                  {farmer.stats.rating}
                </p>
                <p className="text-[10px] sm:text-xs text-white/80 font-medium uppercase tracking-wider">
                  Rating
                </p>
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              {farmer.phoneNumber && (
                <a
                  href={`tel:${farmer.phoneNumber}`}
                  className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-sm sm:text-base border border-white/15 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <Phone className="w-4 h-4 text-emerald-200" />
                  <span>{farmer.phoneNumber}</span>
                </a>
              )}

              {farmer.email && (
                <a
                  href={`mailto:${farmer.email}`}
                  className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-sm sm:text-base border border-white/15 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <Mail className="w-4 h-4 text-amber-200" />
                  <span>Contact</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
