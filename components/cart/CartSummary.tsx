"use client";

import Link from "next/link";
import { ShieldCheck, Truck } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

interface Props {
  subtotal: number;
  itemCount: number;
}

export default function CartSummary({ subtotal, itemCount }: Props) {
  const delivery = 0;
  const total = subtotal + delivery;

  return (
    <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 sticky top-28">
      <h3 className="text-lg font-bold text-ink-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-500">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-semibold text-ink-900">
            {formatINR(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-500">Delivery</span>
          <span className="font-semibold text-brand-700">
            {delivery === 0 ? "Free" : formatINR(delivery)}
          </span>
        </div>

        <div className="pt-3 border-t border-brand-50 flex justify-between">
          <span className="font-bold text-ink-900">Total</span>
          <span className="text-lg font-extrabold text-brand-700">
            {formatINR(total)}
          </span>
        </div>
      </div>

      <Link href="/checkout" className="block mt-6">
        <Button size="lg" className="w-full">
          Proceed to Checkout
        </Button>
      </Link>

      <div className="mt-5 space-y-2 text-xs text-ink-500">
        <p className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-brand-600" />
          Same-day harvest, under 24 hours delivery
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
          Not fresh? Full refund, no questions asked
        </p>
      </div>
    </div>
  );
}   