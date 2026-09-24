import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getCategories } from "@/lib/queries/categories";
import ProductForm from "@/components/farmer/ProductForm";

export const metadata = { title: "Add Product — Freshique Farm" };

export default async function NewProductPage() {
    const { profile } = await requireRole(
        "farmer",
        "/farmer/dashboard/products/new"
    );
    const categories = await getCategories();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/farmer/dashboard/products"
                    className="grid place-items-center h-9 w-9 rounded-lg bg-white text-brand-700 shadow-card hover:bg-brand-50 transition"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-extrabold text-ink-900">
                    Add New Product
                </h1>
            </div>

            <ProductForm
                categories={categories}
                mode="create"
                initial={{
                    name: "",
                    description: "",
                    price: 0,
                    unit: "",
                    stock: 0,
                    city: profile.city ?? "",
                    category_id: null,
                    is_active: true,
                    image_url: null,
                }}
            />
        </div>
    );
}