import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import Badge from "@/components/ui/Badge";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import AddToCartInline from "@/components/cart/AddToCartInline";
import { formatINR } from "@/lib/utils";
import type { ProductCard as ProductCardType } from "@/lib/queries/products";

interface Props {
  product: ProductCardType;
  initialFavorited?: boolean;
}

export default function ProductCard({
  product,
  initialFavorited = false,
}: Props) {
  return (
    <div className="group relative rounded-2xl bg-white border border-brand-50 shadow-card hover:shadow-float hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <FavoriteButton
        productId={product.id}
        initialFavorited={initialFavorited}
        className="absolute top-3 right-3 z-10"
      />

      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-brand-50/30">
          {product.primary_image ? (
            <Image
              src={product.primary_image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="grid place-items-center h-full w-full text-brand-300">
              <ImageOff className="h-8 w-8" />
            </div>
          )}

          {product.category_name && (
            <span className="absolute top-3 left-3">
              <Badge tone="brand" size="sm">
                {product.category_name}
              </Badge>
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-base font-bold text-ink-900 truncate group-hover:text-brand-700 transition">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-extrabold text-brand-700 leading-tight">
              {formatINR(product.price)}
            </p>
            <p className="text-xs text-ink-500 truncate">per {product.unit}</p>
          </div>

          <AddToCartInline
            productId={product.id}
            productName={product.name}
            productPrice={product.price}
            productUnit={product.unit}
            productImage={product.primary_image}
            productCity={product.city}
            productSlug={product.slug}
            productStock={99}
            farmerName={null}
          />
        </div>
      </div>
    </div>
  );
}