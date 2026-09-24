import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getFarmerProducts } from "@/lib/queries/farmer";
import ProductRow from "@/components/farmer/ProductRow";
import Button from "@/components/ui/Button";

export const metadata = { title: "My Products — Freshique Farm" };

export default async function FarmerProductsPage() {
    const { user } = await requireRole("farmer", "/farmer/dashboard/products");
    const products = await getFarmerProducts(user.id);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-ink-900">
                        My Products
                    </h1>
                    <p className="text-sm text-ink-500 mt-1">
                        {products.length}{" "}
                        {products.length === 1 ? "product" : "products"} listed
                    </p>
                </div>
                <Link href="/farmer/dashboard/products/new">
                    <Button>
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-white/50 px-6 py-20 text-center">
                    <div className="mx-auto grid place-items-center h-20 w-20 rounded-2xl bg-brand-50 text-brand-300 mb-5">
                        <Package className="h-10 w-10" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold text-ink-900 mb-2">
                        No products yet
                    </h2>
                    <p className="text-sm text-ink-500 mb-6 max-w-sm mx-auto">
                        Add your first product to start selling on Freshique Farm.
                    </p>
                    <Link href="/farmer/dashboard/products/new">
                        <Button>
                            <Plus className="h-4 w-4" />
                            Add Your First Product
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {products.map((p) => (
                        <ProductRow key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}