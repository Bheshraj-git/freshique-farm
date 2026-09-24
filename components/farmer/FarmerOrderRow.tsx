import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ImageOff } from "lucide-react";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { formatINR } from "@/lib/utils";
import type { FarmerOrderListItem } from "@/lib/queries/farmer";
import type { OrderStatus } from "@/lib/queries/orders";

export default function FarmerOrderRow({ order }: { order: FarmerOrderListItem }) {
    const date = new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <Link
            href={`/farmer/dashboard/orders/${order.id}`}
            className="flex items-center gap-4 rounded-2xl bg-white border border-brand-50 shadow-card p-4 hover:shadow-float transition group"
        >
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-brand-50 shrink-0">
                {order.my_item_image ? (
                    <Image
                        src={order.my_item_image}
                        alt={order.my_item_preview ?? ""}
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                ) : (
                    <div className="grid place-items-center h-full w-full text-brand-300">
                        <ImageOff className="h-5 w-5" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <OrderStatusBadge status={order.status as OrderStatus} />
                    <span className="text-xs text-ink-500">
                        #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                </div>
                <p className="text-sm font-bold text-ink-900 truncate">
                    {order.my_item_preview}
                    {order.my_item_count > 1 && (
                        <span className="text-ink-500 font-medium">
                            {" "}
                            + {order.my_item_count - 1} from you
                        </span>
                    )}
                </p>
                <p className="text-xs text-ink-500 mt-0.5">
                    {order.buyer_name} · {date}
                </p>
            </div>

            <div className="text-right shrink-0 flex items-center gap-3">
                <p className="text-lg font-extrabold text-brand-700">
                    {formatINR(order.total)}
                </p>
                <ChevronRight className="h-5 w-5 text-ink-300 group-hover:text-brand-600 transition" />
            </div>
        </Link>
    );
}