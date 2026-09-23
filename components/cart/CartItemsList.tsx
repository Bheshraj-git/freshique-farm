"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";
import CartItemRow from "./CartItemRow";
import EmptyCart from "./EmptyCart";
import type { CartLine } from "@/lib/queries/cart";

interface Props {
  initialItems: CartLine[];
}

export default function CartItemsList({ initialItems }: Props) {
  const items = useCartStore((s) => s.items);
  const setItems = useCartStore((s) => s.setItems);
  const hydrated = useCartStore((s) => s.hydrated);

  // Ensure store matches server whenever server data changes
  useEffect(() => {
    // Only sync if we're not hydrated or the server data differs from local
    if (!hydrated || items.length !== initialItems.length) {
      setItems(initialItems);
    }
  }, [initialItems, hydrated, items.length, setItems]);

  const list = hydrated ? items : initialItems;

  if (list.length === 0) return <EmptyCart />;

  return (
    <div className="space-y-4">
      {list.map((line) => (
        <CartItemRow key={line.id} line={line} />
      ))}
    </div>
  );
}