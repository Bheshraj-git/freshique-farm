import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ImageOff, Package } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatINR } from "@/lib/utils";
import type { OrderListItem } from "@/lib/queries/orders";

interface Props {
  order: OrderListItem;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrderCard({ order }: Props) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-2xl bg-white border border-brand-50 shadow-card p-5 hover:shadow-float transition group"
    >
      <div className="flex items-center gap-5">
        {/* Preview image */}
        <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden bg-brand-50 shrink-0">
          {order.preview_image ? (
            <Image
              src={order.preview_image}
              alt={order.preview_name ?? "Order item"}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="grid place-items-center h-full w-full text-brand-300">
              <ImageOff className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Middle */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <OrderStatusBadge status={order.status} />
            <span className="text-xs text-ink-500">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <p className="text-sm font-bold text-ink-900 truncate">
            {order.preview_name}
            {order.item_count > 1 && (
              <span className="text-ink-500 font-medium">
                {" "}
                + {order.item_count - 1} more
              </span>
            )}
          </p>

          <p className="text-xs text-ink-500 mt-1">
            {formatDate(order.created_at)} · {order.item_count}{" "}
            {order.item_count === 1 ? "item" : "items"}
          </p>
        </div>

        {/* Right */}
        <div className="text-right shrink-0 flex items-center gap-3">
          <div>
            <p className="text-xs text-ink-500 mb-0.5">Total</p>
            <p className="text-lg font-extrabold text-brand-700">
              {formatINR(order.total)}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-ink-300 group-hover:text-brand-600 transition" />
        </div>
      </div>
    </Link>
  );
}