"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useUser } from "@/lib/hooks/useUser";
import { useToast } from "@/lib/toast";
import { useCartStore } from "@/lib/store/cart";
import { addToCartAction } from "@/app/(cart)/actions";
import type { ProductDetail } from "@/lib/queries/products";

interface Props {
  product: ProductDetail;
}

export default function AddToCartButton({ product }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading } = useUser();
  const { push } = useToast();
  const addOpt = useCartStore((s) => s.addOptimistic);

  const [busy, setBusy] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const outOfStock = product.stock <= 0;

  async function handleClick() {
    if (busy || outOfStock || loading) return;

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

    const tempId = `temp-${Date.now()}`;
    addOpt({
      id: tempId,
      product_id: product.id,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        unit: product.unit,
        city: product.city,
        stock: product.stock,
        image: product.images[0] ?? null,
        farmer_name: product.farmer_name,
      },
    });

    const result = await addToCartAction(product.id, 1);

    if (!result.ok) {
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
    <Button
      type="button"
      size="lg"
      className="w-full"
      loading={busy}
      disabled={outOfStock}
      onClick={handleClick}
    >
      {!busy && !justAdded && <ShoppingCart className="h-5 w-5" />}
      {!busy && justAdded && <Check className="h-5 w-5" />}
      {justAdded ? "Added to Cart" : outOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}