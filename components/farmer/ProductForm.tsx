"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import {
    createProductAction,
    updateProductAction,
    type ProductActionResult,
} from "@/app/farmer/dashboard/products/actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ProductImageUpload from "./ProductImageUpload";
import { useToast } from "@/lib/toast";
import type { Category } from "@/lib/queries/categories";

interface Props {
    categories: Category[];
    mode: "create" | "edit";
    productId?: string;
    initial?: {
        name: string;
        description: string;
        price: number;
        unit: string;
        stock: number;
        city: string;
        category_id: string | null;
        is_active: boolean;
        image_url: string | null;
    };
}

export default function ProductForm({
    categories,
    mode,
    productId,
    initial,
}: Props) {
    const router = useRouter();
    const { push } = useToast();

    const action =
        mode === "create"
            ? createProductAction
            : (prev: ProductActionResult | undefined, fd: FormData) =>
                updateProductAction(productId!, prev, fd);

    const [state, formAction, isPending] = useActionState(action, undefined);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        initial?.image_url ?? null
    );

    useEffect(() => {
        if (state?.ok) {
            push(
                "success",
                mode === "create" ? "Product created" : "Product updated"
            );
            router.push("/farmer/dashboard/products");
            router.refresh();
        }
    }, [state?.ok, mode, push, router]);

    return (
        <form action={formAction} className="space-y-6">
            <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 space-y-5">
                <h2 className="text-lg font-bold text-ink-900">
                    {mode === "create" ? "New Product" : "Edit Product"}
                </h2>

                <Input
                    label="Product Name"
                    name="name"
                    placeholder="e.g. Fresh Fig"
                    defaultValue={initial?.name}
                    required
                    error={state?.fieldErrors?.name}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="Price (₹)"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="68.99"
                        defaultValue={initial?.price?.toString()}
                        required
                        error={state?.fieldErrors?.price}
                    />
                    <Input
                        label="Unit"
                        name="unit"
                        placeholder="e.g. gram (250), kg, pieces"
                        defaultValue={initial?.unit}
                        required
                        error={state?.fieldErrors?.unit}
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        label="Stock"
                        name="stock"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="40"
                        defaultValue={initial?.stock?.toString()}
                        required
                        error={state?.fieldErrors?.stock}
                    />
                    <Input
                        label="City"
                        name="city"
                        placeholder="Bhavnagar"
                        defaultValue={initial?.city}
                        required
                        error={state?.fieldErrors?.city}
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-ink-900 mb-1.5 block">
                        Category
                    </label>
                    <select
                        name="category_id"
                        defaultValue={initial?.category_id ?? ""}
                        className="w-full rounded-xl border border-ink-300 bg-white/70 px-4 py-3 text-ink-900 focus:border-brand-500 focus:outline-none"
                    >
                        <option value="">Select a category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-semibold text-ink-900 mb-1.5 block">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        defaultValue={initial?.description}
                        placeholder="Describe your product, farming practices, flavor profile..."
                        className="w-full rounded-xl border border-ink-300 bg-white/70 px-4 py-3 text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:bg-white focus:outline-none resize-none"
                    />
                </div>

                <ProductImageUpload initialUrl={previewUrl} />

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_active"
                        defaultChecked={initial?.is_active ?? true}
                        className="h-4 w-4 accent-brand-600"
                    />
                    <span className="text-sm font-medium text-ink-700">
                        Visible on market (uncheck to hide)
                    </span>
                </label>

                {state?.error && (
                    <p className="rounded-xl bg-danger-500/10 text-danger-600 px-4 py-3 text-sm font-medium">
                        {state.error}
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    type="submit"
                    size="lg"
                    loading={isPending}
                    className="w-full sm:w-auto"
                >
                    <Save className="h-4 w-4" />
                    {mode === "create" ? "Create Product" : "Save Changes"}
                </Button>
                <button
                    type="button"
                    onClick={() => router.push("/farmer/dashboard/products")}
                    className="rounded-xl border border-brand-200 bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50 transition"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}