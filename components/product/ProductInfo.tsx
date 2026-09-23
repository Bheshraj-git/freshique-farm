import { MapPin, Leaf } from "lucide-react";
import { formatINR } from "@/lib/utils";
import type { ProductDetail } from "@/lib/queries/products";

interface Props {
  product: ProductDetail;
}

export default function ProductInfo({ product }: Props) {
  const inStock = product.stock > 0;

  return (
    <div className="space-y-5">
      {/* Title + location */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink-900">
          {product.name}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin className="h-4 w-4 text-brand-600" />
          {product.city}, India
        </p>
      </div>

      {/* Price card */}
      <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-4xl md:text-5xl font-extrabold text-brand-700">
            {formatINR(product.price)}
          </span>
          <span className="text-sm text-ink-500 font-medium">
            / {product.unit}
          </span>
        </div>

        {inStock ? (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-bold text-brand-800">
            <Leaf className="h-3.5 w-3.5" />
            In Stock: {product.stock} {product.unit}
          </div>
        ) : (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-danger-500/10 px-3.5 py-1.5 text-xs font-bold text-danger-600">
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
}