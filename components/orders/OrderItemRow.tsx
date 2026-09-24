import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { formatINR } from "@/lib/utils";
import type { OrderItem } from "@/lib/queries/orders";

interface Props {
  item: OrderItem;
}

export default function OrderItemRow({ item }: Props) {
  const inner = (
    <div className="flex items-center gap-4 rounded-xl bg-brand-50/30 border border-brand-50 p-4">
      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white shrink-0">
        {item.product_image ? (
          <Image
            src={item.product_image}
            alt={item.product_name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="grid place-items-center h-full w-full text-brand-300">
            <ImageOff className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-ink-900 truncate">
          {item.product_name}
        </p>
        <p className="text-xs text-ink-500 mt-0.5">
          {formatINR(item.unit_price)} / {item.product_unit}
        </p>
        <p className="text-xs text-ink-500 mt-0.5">
          Qty: {item.quantity}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-base font-extrabold text-brand-700">
          {formatINR(item.subtotal)}
        </p>
      </div>
    </div>
  );

  if (item.product_id) {
    return (
      <Link href={`/product/${item.product_id}`} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}