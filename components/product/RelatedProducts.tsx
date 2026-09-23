import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/market/ProductCard";
import type { ProductCard as ProductCardType } from "@/lib/queries/products";

interface Props {
  products: ProductCardType[];
  favoritedIds?: Set<string>;
}

export default function RelatedProducts({
  products,
  favoritedIds,
}: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-extrabold text-ink-900">
          You might also like
        </h2>
        <Link
          href="/market"
          className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800"
        >
          View Market
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            initialFavorited={favoritedIds?.has(p.id) ?? false}
          />
        ))}
      </div>
    </section>
  );
}