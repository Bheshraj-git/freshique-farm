"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ImageOff } from "lucide-react";
import type { CartLine } from "@/lib/queries/cart";
import {
  updateCartQuantityAction,
  removeCartLineAction,
} from "@/app/(cart)/actions";
import { useCartStore } from "@/lib/store/cart";
import { useToast } from "@/lib/toast";
import { cn, formatINR } from "@/lib/utils";

interface Props {
  line: CartLine;
}

export default function CartItemRow({ line }: Props) {
  const router = useRouter();
  const { push } = useToast();
  const updateOpt = useCartStore((s) => s.updateQuantityOptimistic);
  const removeOpt = useCartStore((s) => s.removeOptimistic);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const atMax = line.quantity >= line.product.stock;
  const atMin = line.quantity <= 1;

  async function setQuantity(next: number) {
    if (busy) return;
    setBusy(true);

    const previous = line.quantity;
    updateOpt(line.id, next);

    const result = await updateCartQuantityAction(line.id, next);

    if (!result.ok) {
      // revert
      updateOpt(line.id, previous);
      push("error", result.error || "Could not update quantity");
    } else {
      startTransition(() => router.refresh());
    }
    setBusy(false);
  }

  async function remove() {
    if (busy) return;
    setBusy(true);

    removeOpt(line.id);
    const result = await removeCartLineAction(line.id);

    if (!result.ok) {
      // reload data to recover
      push("error", result.error || "Could not remove item");
      router.refresh();
    } else {
      push("success", "Removed from cart");
      startTransition(() => router.refresh());
    }
    setBusy(false);
  }

  return (
    <div
      className={cn(
        "flex gap-4 rounded-2xl bg-white border border-brand-50 shadow-card p-4",
        busy && "opacity-70"
      )}
    >
      {/* Image */}
      <Link
        href={`/product/${line.product.id}`}
        className="relative h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden bg-brand-50 shrink-0"
      >
        {line.product.image ? (
          <Image
            src={line.product.image}
            alt={line.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="grid place-items-center h-full w-full text-brand-300">
            <ImageOff className="h-6 w-6" />
          </div>
        )}
      </Link>

      {/* Middle */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/product/${line.product.id}`}
          className="block text-base md:text-lg font-bold text-ink-900 truncate hover:text-brand-700 transition"
        >
          {line.product.name}
        </Link>
        <p className="text-xs text-ink-500 mt-0.5">
          {line.product.city}
          {line.product.farmer_name ? ` • ${line.product.farmer_name}` : ""}
        </p>
        <p className="text-sm font-bold text-brand-700 mt-2">
          {formatINR(line.product.price)}{" "}
          <span className="text-xs text-ink-500 font-medium">
            / {line.product.unit}
          </span>
        </p>

        {/* Quantity stepper */}
        <div className="mt-3 inline-flex items-center gap-3 rounded-xl bg-brand-50 border border-brand-100 px-2 py-1">
          <button
            type="button"
            onClick={() => setQuantity(line.quantity - 1)}
            disabled={busy || atMin}
            aria-label="Decrease quantity"
            className="grid place-items-center h-7 w-7 rounded-lg bg-white text-brand-700 hover:bg-brand-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-8 text-center text-sm font-bold text-ink-900">
            {line.quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(line.quantity + 1)}
            disabled={busy || atMax}
            aria-label="Increase quantity"
            className="grid place-items-center h-7 w-7 rounded-lg bg-white text-brand-700 hover:bg-brand-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        {atMax && (
          <p className="text-xs text-accent-600 font-medium mt-2">
            Max {line.product.stock} available
          </p>
        )}
      </div>

      {/* Right — subtotal + remove */}
      <div className="flex flex-col items-end justify-between gap-3">
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          aria-label={`Remove ${line.product.name}`}
          className="grid place-items-center h-8 w-8 rounded-lg text-ink-500 hover:text-danger-600 hover:bg-danger-500/10 transition"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <p className="text-base md:text-lg font-extrabold text-ink-900 whitespace-nowrap">
          {formatINR(line.product.price * line.quantity)}
        </p>
      </div>
    </div>
  );
}