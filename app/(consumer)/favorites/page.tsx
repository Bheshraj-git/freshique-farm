import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { getFavoriteProducts } from "@/lib/queries/favorites";
import ProductCard from "@/components/market/ProductCard";
import EmptyFavorites from "@/components/favorites/EmptyFavorites";
import Badge from "@/components/ui/Badge";

export const metadata = {
  title: "Favorites — Freshique Farm",
};

export default async function FavoritesPage() {
  await requireAuth("/favorites");

  const favorites = await getFavoriteProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 md:mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            aria-label="Back to profile"
            className="grid place-items-center h-9 w-9 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Heart
              className="h-5 w-5 text-danger-600"
              fill="currentColor"
              strokeWidth={0}
            />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-ink-900">
              Your Favorites
            </h1>
          </div>
        </div>

        <Badge tone="neutral" size="md">
          {favorites.length} {favorites.length === 1 ? "Item" : "Items"}
        </Badge>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {favorites.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              initialFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}