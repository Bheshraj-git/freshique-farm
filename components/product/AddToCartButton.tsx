"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";
import { useUser } from "@/lib/hooks/useUser";
import { useToast } from "@/lib/toast";

interface Props {
  productId: string;
  disabled?: boolean;
}

export default function AddToCartButton({ productId, disabled }: Props) {
  const router = useRouter();
  const { user, profile, loading } = useUser();
  const { push } = useToast();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (loading) return;

    // Not signed in
    if (!user) {
      push("info", "Please log in to add items");
      setTimeout(() => {
        router.push(`/login?next=/product/${productId}`);
      }, 700);
      return;
    }

    // Farmers can't shop
    if (profile?.role === "farmer") {
      push("error", "Only consumers can purchase items");
      return;
    }

    // Consumer, logged in — Phase 11 wires the real cart
    setBusy(true);
    push("success", "Added to cart");
    setTimeout(() => setBusy(false), 600);
  }

  return (
    <Button
      type="button"
      size="lg"
      className="w-full"
      loading={busy}
      disabled={disabled}
      onClick={handleClick}
    >
      {!busy && <ShoppingCart className="h-5 w-5" />}
      Add to Cart
    </Button>
  );
}