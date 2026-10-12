import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPublicFarmerProfile } from "@/lib/queries/farmerProfile";
import FarmerHero from "@/components/farmerPage/FarmerHero";
import BestSellingSection from "@/components/farmerPage/BestSellingSection";
import FarmerProductsSection from "@/components/farmerPage/FarmerProductsSection";
import FarmerStoriesSection from "@/components/farmerPage/FarmerStoriesSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getPublicFarmerProfile(id);

  if (!profile) {
    return {
      title: "Farmer Profile — Freshique Farm",
      description: "Discover fresh, organically grown farm produce.",
    };
  }

  return {
    title: `${profile.fullName} — Verified Farmer | Freshique Farm`,
    description: `Explore authentic farm produce, customer favorites, and farming stories from ${profile.fullName} in ${profile.location.city}, ${profile.location.state}.`,
    openGraph: {
      title: `${profile.fullName} — Freshique Farm`,
      description: `Organic produce from ${profile.location.city}, ${profile.location.state}. ${profile.stats.totalOrders} orders completed.`,
      images: profile.profilePicture ? [profile.profilePicture] : [],
    },
  };
}

export default async function FarmerPage({ params }: PageProps) {
  const { id } = await params;
  const farmer = await getPublicFarmerProfile(id);

  if (!farmer) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🌾
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Farmer Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            We couldn&apos;t locate the profile for this farmer. They might have
            updated their account or changed regions.
          </p>
          <Link
            href="/market"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Other Farmers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <FarmerHero farmer={farmer} />

      {/* Best Selling Products */}
      {farmer.topProducts && farmer.topProducts.length > 0 && (
        <BestSellingSection products={farmer.topProducts} />
      )}

      {/* All Farmer Products */}
      <FarmerProductsSection
        products={farmer.products}
        farmerName={farmer.fullName}
      />

      {/* Farming Stories & Tips */}
      {farmer.blogs && farmer.blogs.length > 0 && (
        <FarmerStoriesSection blogs={farmer.blogs} />
      )}
    </div>
  );
}
