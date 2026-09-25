import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  getProductById,
  getRelatedProducts,
} from "@/lib/queries/products";
import { getFavoritedProductIds } from "@/lib/queries/favorites";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SellerCard from "@/components/product/SellerCard";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductDescription from "@/components/product/ProductDescription";
import RelatedProducts from "@/components/product/RelatedProducts";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product not found — Freshique Farm" };
  return { title: `${product.name} — Freshique Farm` };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [related, favoritedIds] = await Promise.all([
    getRelatedProducts(product.category_id, product.id, 4),
    getFavoritedProductIds(),
  ]);

  const outOfStock = product.stock <= 0;
  const isFavorited = favoritedIds.has(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-6">
      <nav className="mb-4 sm:mb-8 flex items-center gap-2 text-xs sm:text-sm text-ink-500">
        <Link href="/market" className="hover:text-brand-700">
          Market
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {product.category_slug ? (
          <>
            <Link
              href={`/market?category=${product.category_slug}`}
              className="hover:text-brand-700"
            >
              {product.category_name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        ) : null}
        <span className="text-ink-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          name={product.name}
          productId={product.id}
          initialFavorited={isFavorited}
        />

        <div className="space-y-6">
          <ProductInfo product={product} />
          <SellerCard
            farmerId={product.farmer_id}
            farmerName={product.farmer_name}
            farmerAvatar={product.farmer_avatar}
          />
          <AddToCartButton product={product} />
        </div>
      </div>

      <ProductDescription description={product.description} />

      <RelatedProducts products={related} favoritedIds={favoritedIds} />
    </div>
  );
}