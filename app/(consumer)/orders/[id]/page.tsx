import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Hash, Wallet } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { getOrderById } from "@/lib/queries/orders";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderItemRow from "@/components/orders/OrderItemRow";
import CancelOrderButton from "@/components/orders/CancelOrderButton";
import { formatINR } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  return {
    title: order
      ? `Order #${order.id.slice(0, 8).toUpperCase()} — Freshique Farm`
      : "Order not found — Freshique Farm",
  };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  await requireAuth(`/orders/${id}`);

  const order = await getOrderById(id);
  if (!order) notFound();

  const canCancel = order.status === "pending";

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/orders"
          aria-label="Back to orders"
          className="grid place-items-center h-9 w-9 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </h1>
      </div>

      {/* Status + meta */}
      <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <OrderStatusBadge status={order.status} />
          {canCancel && <CancelOrderButton orderId={order.id} />}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetaRow
            icon={Calendar}
            label="Placed on"
            value={formatDate(order.created_at)}
          />
          <MetaRow
            icon={Hash}
            label="Items"
            value={`${order.items.reduce((s, i) => s + i.quantity, 0)}`}
          />
          <MetaRow
            icon={Wallet}
            label="Payment"
            value={order.notes === "cod" ? "Cash on Delivery" : "—"}
          />
        </div>
      </div>

      {/* Items */}
      <section className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 mb-6">
        <h2 className="text-lg font-bold text-ink-900 mb-4">
          Items in this order
        </h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Address + Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Address */}
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

        {/* Summary */}
        <section className="rounded-2xl bg-white border border-brand-50 shadow-card p-6">
          <h2 className="text-lg font-bold text-ink-900 mb-4">
            Payment Summary
          </h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">Subtotal</span>
              <span className="font-semibold text-ink-900">
                {formatINR(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Delivery Charge</span>
              <span className="font-semibold text-ink-900">
                {formatINR(order.delivery_fee)}
              </span>
            </div>
            <div className="pt-3 border-t border-brand-50 flex justify-between items-center">
              <span className="font-bold text-ink-900">Total</span>
              <span className="text-xl font-extrabold text-brand-700">
                {formatINR(order.total)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetaRow({
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