import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    User as UserIcon,
    Hash,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getFarmerOrderDetail } from "@/lib/queries/farmer";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderStatusActions from "@/components/farmer/OrderStatusActions";
import OrderItemRow from "@/components/orders/OrderItemRow";
import { formatINR } from "@/lib/utils";
import type { OrderStatus } from "@/lib/queries/orders";

interface PageProps {
    params: Promise<{ id: string }>;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default async function FarmerOrderDetailPage({ params }: PageProps) {
    const { id } = await params;
    const { user } = await requireRole("farmer", `/farmer/dashboard/orders/${id}`);
    const order = await getFarmerOrderDetail(id, user.id);

    if (!order) notFound();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/farmer/dashboard/orders"
                    aria-label="Back to orders"
                    className="grid place-items-center h-9 w-9 rounded-lg bg-white text-brand-700 shadow-card hover:bg-brand-50 transition"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                </h1>
            </div>

            {/* Status + actions */}
            <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <OrderStatusBadge status={order.status as OrderStatus} />
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mb-5">
                    <Meta icon={Calendar} label="Placed" value={formatDate(order.created_at)} />
                    <Meta icon={UserIcon} label="Buyer" value={order.buyer_name} />
                    <Meta
                        icon={Hash}
                        label="Your items"
                        value={`${order.my_items.reduce((s, i) => s + i.quantity, 0)}`}
                    />
                </div>

                <OrderStatusActions orderId={order.id} currentStatus={order.status} />
            </div>

            {/* Your items in this order */}
            <section className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 mb-6">
                <h2 className="text-lg font-bold text-ink-900 mb-4">
                    Your items in this order
                </h2>
                <div className="space-y-3">
                    {order.my_items.map((item) => (
                        <OrderItemRow
                            key={item.id}
                            item={{
                                id: item.id,
                                product_id: item.product_id,
                                product_name: item.product_name,
                                product_unit: item.product_unit,
                                product_image: item.product_image,
                                quantity: item.quantity,
                                unit_price: item.unit_price,
                                subtotal: item.subtotal,
                                farmer_id: null,
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* Delivery address + your earnings */}
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl bg-white border border-brand-50 shadow-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-100 text-brand-700">
                            <MapPin className="h-4 w-4" />
                        </span>
                        <h2 className="text-lg font-bold text-ink-900">
                            Delivery Address
                        </h2>
                    </div>
                    <p className="text-sm text-ink-700 leading-relaxed">
                        {order.shipping_address}
                    </p>
                </section>

                <section className="rounded-2xl bg-white border border-brand-50 shadow-card p-6">
                    <h2 className="text-lg font-bold text-ink-900 mb-4">
                        Your items total
                    </h2>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-ink-500">Earned from this order</span>
                        <span className="text-2xl font-extrabold text-brand-700">
                            {formatINR(
                                order.my_items.reduce((s, i) => s + i.subtotal, 0)
                            )}
                        </span>
                    </div>
                </section>
            </div>
        </div>
    );
}

function Meta({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
            <div>
                <p className="text-xs text-ink-500">{label}</p>
                <p className="text-sm font-medium text-ink-900">{value}</p>
            </div>
        </div>
    );
}