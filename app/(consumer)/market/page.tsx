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

  const minNum = params.min ? Number(params.min) : undefined;
  const maxNum = params.max ? Number(params.max) : undefined;

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
      <div className="hidden lg:block mb-8">
        <MarketFilters cities={cities} categories={categories} />
      </div>

      <div className="lg:hidden mb-4 sm:mb-6">
        <MarketFiltersMobile cities={cities} categories={categories} />
      </div>

      {products.length === 0 ? (
        <EmptyProducts />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {products.map((p, idx) => (
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