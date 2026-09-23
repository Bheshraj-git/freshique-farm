"use client";

import { useCartStore } from "@/lib/store/cart";

interface Props {
  className?: string;
}

export default function CartBadge({ className }: Props) {
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  if (count === 0) return null;

  return (
    <span
      className={
        className ??
        "absolute -top-1 -right-1 grid place-items-center min-w-[18px] h-[18px] rounded-full bg-danger-600 px-1 text-[10px] font-bold text-white ring-2 ring-white"
      }
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}