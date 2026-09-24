import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatINR } from "@/lib/utils";
import type { CartLine } from "@/lib/queries/cart";

interface Props {
  line: CartLine;
}

export default function CheckoutItemRow({ line }: Props) {
  const total = line.product.price * line.quantity;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-brand-50/40 border border-brand-50 p-3">
      {/* Image */}
      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-white shrink-0">
        {line.product.image ? (
          <Image
            src={line.product.image}
            alt={line.product.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="grid place-items-center h-full w-full text-brand-300">
            <ImageOff className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Middle */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-ink-900 truncate">
          {line.product.name}
        </p>
        <p className="text-xs text-ink-500 mt-0.5">
          {formatINR(line.product.price)}/{line.product.unit}
        </p>
      </div>

      {/* Right */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-ink-900">
          {formatINR(total)}
        </p>
        <p className="text-xs text-ink-500 mt-0.5">Qty: {line.quantity}</p>
      </div>
    </div>
  );
}