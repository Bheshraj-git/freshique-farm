import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries/categories";
import ProductForm from "@/components/farmer/ProductForm";

export const metadata = { title: "Edit Product — Freshique Farm" };

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;
    const { user, profile } = await requireRole(
        "farmer",
        `/farmer/dashboard/products/${id}/edit`
    );

    const supabase = await createClient();
    const { data } = await supabase
        .from("products")
        .select(
            `
      id, name, description, price, unit, stock, city, category_id, is_active,
      farmer_id,
      images:product_images(url, position)
    `
        )
        .eq("id", id)
        .maybeSingle();

    if (!data || data.farmer_id !== user.id) notFound();

    const images = Array.isArray((data as any).images)
        ? (data as any).images
        : [];
    images.sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
    const primaryImage = images[0]?.url ?? null;

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
                    Edit Product
                </h1>
            </div>

            <ProductForm
                categories={categories}
                mode="edit"
                productId={data.id}
                initial={{
                    name: data.name,
                    description: data.description ?? "",
                    price: Number(data.price),
                    unit: data.unit,
                    stock: Number(data.stock),
                    city: data.city,
                    category_id: data.category_id,
                    is_active: data.is_active,
                    image_url: primaryImage,
                }}
            />
        </div>
    );
}