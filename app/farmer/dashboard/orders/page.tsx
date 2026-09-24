import { ClipboardList } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getFarmerOrders } from "@/lib/queries/farmer";
import FarmerOrderRow from "@/components/farmer/FarmerOrderRow";

export const metadata = { title: "Orders — Freshique Farm" };

export default async function FarmerOrdersPage() {
    const { user } = await requireRole("farmer", "/farmer/dashboard/orders");
    const orders = await getFarmerOrders(user.id);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-ink-900">Orders</h1>
                <p className="text-sm text-ink-500 mt-1">
                    Orders containing your products
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-white/50 px-6 py-20 text-center">
                    <div className="mx-auto grid place-items-center h-20 w-20 rounded-2xl bg-brand-50 text-brand-300 mb-5">
                        <ClipboardList className="h-10 w-10" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold text-ink-900 mb-2">
                        No orders yet
                    </h2>
                    <p className="text-sm text-ink-500 max-w-sm mx-auto">
                        When customers order your products, the orders will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((o) => (
                        <FarmerOrderRow key={o.id} order={o} />
                    ))}
                </div>
            )}
        </div>
    );
}