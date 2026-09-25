import { requireAuth } from "@/lib/auth";
import { getUserOrders } from "@/lib/queries/orders";
import OrderCard from "@/components/orders/OrderCard";
import EmptyOrders from "@/components/orders/EmptyOrders";

export const metadata = {
  title: "My Orders — Freshique Farm",
};

export default async function OrdersPage() {
  await requireAuth("/orders");
  const orders = await getUserOrders();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 md:py-8">
      <div className="flex items-center justify-between gap-4 mb-4 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900">My Orders</h1>
        {orders.length > 0 && (
          <span className="text-sm text-ink-500">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}