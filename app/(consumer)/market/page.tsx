import { listProducts } from "@/lib/queries/products";
import { getCategories, getCities } from "@/lib/queries/categories";
import { getFavoritedProductIds } from "@/lib/queries/favorites";
import ProductCard from "@/components/market/ProductCard";
import EmptyProducts from "@/components/market/EmptyProducts";
import MarketFilters from "@/components/market/MarketFilters";
import MarketFiltersMobile from "@/components/market/MarketFiltersMobile";
import FadeIn from "@/components/ui/FadeIn";

export const metadata = {
  title: "Market — Freshique Farm",
};

// Read the current market filters from the URL.
interface PageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    category?: string;
    min?: string;
    max?: string;
  }>;
}

export default async function MarketPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Ignore invalid price filters instead of passing NaN to the product query.
  const minNum = params.min ? Number(params.min) : undefined;
  const maxNum = params.max ? Number(params.max) : undefined;

  // Load products and supporting filter/favorite data in parallel.
  const [{ products }, cities, categories, favoritedIds] = await Promise.all([
    listProducts({
      q: params.q,
      city: params.city,
      category: params.category,
      min: Number.isFinite(minNum) ? minNum : undefined,
      max: Number.isFinite(maxNum) ? maxNum : undefined,
      limit: 24,
    }),
    getCities(),
    getCategories(),
    getFavoritedProductIds(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      {/* Show the appropriate filter layout for the current screen size. */}
      <div className="hidden lg:block mb-8">
        <MarketFilters cities={cities} categories={categories} />
      </div>

      <div className="lg:hidden mb-4 sm:mb-6">
        <MarketFiltersMobile cities={cities} categories={categories} />
      </div>

      {/* Render an empty state or the matching product cards. */}
      {products.length === 0 ? (
        <EmptyProducts />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {products.map((p, idx) => (
            // Stagger the card entrance animation, with a maximum delay.
            <FadeIn key={p.id} delay={Math.min(idx * 0.05, 0.4)} y={20}>
              <ProductCard
                product={p}
                initialFavorited={favoritedIds.has(p.id)}
              />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}