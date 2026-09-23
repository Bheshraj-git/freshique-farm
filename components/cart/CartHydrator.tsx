"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";
import type { CartLine } from "@/lib/queries/cart";

interface Props {
  initialItems: CartLine[];
}

/**
 * Hydrates the cart store on first mount and whenever server data changes.
 * Rendered in the root layout so the badge always reflects the server truth.
 */
export default function CartHydrator({ initialItems }: Props) {
  const setItems = useCartStore((s) => s.setItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems, setItems]);

  return null;
}