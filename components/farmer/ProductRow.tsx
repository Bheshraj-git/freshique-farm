"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    ImageOff,
    MoreVertical,
} from "lucide-react";
import {
    toggleProductActiveAction,
    deleteProductAction,
} from "@/app/farmer/dashboard/products/actions";
import { useToast } from "@/lib/toast";
import { cn, formatINR } from "@/lib/utils";
import type { FarmerProduct } from "@/lib/queries/farmer";

interface Props {
    product: FarmerProduct;
}

export default function ProductRow({ product }: Props) {
    const router = useRouter();
    const { push } = useToast();
    const [busy, setBusy] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    async function toggleActive() {
        setBusy(true);
        const result = await toggleProductActiveAction(
            product.id,
            !product.is_active
        );
        setBusy(false);
        setMenuOpen(false);
        if (!result.ok) {
            push("error", result.error || "Could not update");
            return;
        }
        push(
            "success",
            product.is_active ? "Product hidden from market" : "Product visible again"
        );
        router.refresh();
    }

    async function handleDelete() {
        setMenuOpen(false);
        if (
            !window.confirm(
                `Delete "${product.name}"? This cannot be undone and will remove it from all listings.`
            )
        ) {
            return;
        }
        setBusy(true);
        const result = await deleteProductAction(product.id);
        setBusy(false);
        if (!result.ok) {
            push("error", result.error || "Could not delete");
            return;
        }
        push("success", "Product deleted");
        router.refresh();
    }

    return (
        <div
            className={cn(
                "relative rounded-2xl bg-white border border-brand-50 shadow-card p-4 flex items-center gap-4",
                !product.is_active && "opacity-60"
            )}
        >
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-brand-50 shrink-0">
                {product.primary_image ? (
                    <Image
                        src={product.primary_image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="grid place-items-center h-full w-full text-brand-300">
                        <ImageOff className="h-5 w-5" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink-900 truncate">
                    {product.name}
                </p>
                <p className="text-xs text-ink-500 mt-0.5">
                    {product.category_name ?? "Uncategorized"}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                    <span className="font-bold text-brand-700">
                        {formatINR(product.price)}
                    </span>
                    <span className="text-ink-500">/ {product.unit}</span>
                    <span className="text-ink-500">·</span>
                    <span
                        className={cn(
                            "font-semibold",
                            product.stock > 0 ? "text-ink-700" : "text-danger-600"
                        )}
                    >
                        {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                    </span>
                </div>
            </div>

            <span
                className={cn(
                    "hidden md:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                    product.is_active
                        ? "bg-brand-100 text-brand-800"
                        : "bg-ink-300/40 text-ink-700"
                )}
            >
                {product.is_active ? "Active" : "Hidden"}
            </span>

            <div className="relative shrink-0">
                <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    disabled={busy}
                    aria-label="Actions"
                    className="grid place-items-center h-9 w-9 rounded-lg hover:bg-brand-50 transition"
                >
                    <MoreVertical className="h-4 w-4 text-ink-500" />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-52 rounded-xl bg-white shadow-float border border-brand-50 py-1.5 z-20">
                        <Link
                            href={`/farmer/dashboard/products/${product.id}/edit`}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50"
                        >
                            <Pencil className="h-4 w-4 text-brand-600" />
                            Edit
                        </Link>
                        <button
                            type="button"
                            onClick={toggleActive}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50 text-left"
                        >
                            {product.is_active ? (
                                <>
                                    <EyeOff className="h-4 w-4 text-accent-500" />
                                    Hide from market
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4 text-brand-600" />
                                    Show on market
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-danger-600 hover:bg-danger-500/5 text-left border-t border-brand-50 mt-1 pt-2.5"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete permanently
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}