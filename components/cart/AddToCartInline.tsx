"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { addToCartAction } from "@/app/(cart)/actions";
import { useCartStore } from "@/lib/store/cart";
import { useUser } from "@/lib/hooks/useUser";
import { useToast } from "@/lib/toast";
import { cn, formatINR } from "@/lib/utils";

interface Props {
  productId: string;
  productName: string;
  productPrice: number;
  productUnit: string;
  productImage: string | null;
  productCity: string;
  productSlug: string;
  productStock: number;
  farmerName: string | null;
}

export default function AddToCartInline({
  productId,
  productName,
  productPrice,
  productUnit,
  productImage,
  productCity,
  productSlug,
  productStock,
  farmerName,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useUser();
  const { push } = useToast();
  const addOpt = useCartStore((s) => s.addOptimistic);

  const [busy, setBusy] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const disabled = productStock <= 0;

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || busy) return;

    // Not signed in → toast + redirect
    if (!user) {
      push("info", "Please log in to add items");
      setTimeout(() => {
        const next = encodeURIComponent(pathname);
        router.push(`/login?next=${next}`);
      }, 700);
      return;
    }

    if (profile?.role === "farmer") {
      push("error", "Only consumers can purchase items");
      return;
    }

    setBusy(true);

    // Optimistic add to store (with a temp id — server will assign real one)
    const tempId = `temp-${Date.now()}`;
    addOpt({
      id: tempId,
      product_id: productId,
      quantity: 1,
      product: {
        id: productId,
        name: productName,
        slug: productSlug,
        price: productPrice,
        unit: productUnit,
        city: productCity,
        stock: productStock,
        image: productImage,
        farmer_name: farmerName,
      },
    });

    const result = await addToCartAction(productId, 1);

    if (!result.ok) {
      // Reload server data to fix the store
      push("error", result.error || "Could not add to cart");
      router.refresh();
      setBusy(false);
      return;
    }

    push("success", "Added to cart");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);

    router.refresh();
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || busy}
      aria-label={disabled ? "Out of stock" : `Add ${productName} to cart`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition",
        "shadow-card active:scale-95",
        disabled
          ? "bg-ink-300 cursor-not-allowed"
          : justAdded
          ? "bg-brand-700"
          : "bg-brand-600 hover:bg-brand-700"
      )}
    >
      {justAdded ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="h-3.5 w-3.5" />
          {disabled ? "Out" : "Add"}
        </>
      )}
    </button>
  );
}