"use client";

import { CreditCard, Banknote, Package } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  subtotal: number;
  delivery: number;
  total: number;
  paymentMethod: "cod" | "card";
  onPaymentMethodChange: (method: "cod" | "card") => void;
  isPlacing?: boolean;
}

export default function OrderSummaryCard({
  subtotal,
  delivery,
  total,
  paymentMethod,
  onPaymentMethodChange,
  isPlacing = false,
}: Props) {
  return (
    <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 sticky top-28">
      <h3 className="text-xl font-bold text-ink-900 mb-5">
        Order Summary
      </h3>

      {/* Numbers */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-500">Subtotal</span>
          <span className="font-semibold text-ink-900">
            {formatINR(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-500">Delivery Charge</span>
          <span className="font-semibold text-ink-900">
            {formatINR(delivery)}
          </span>
        </div>
        <div className="pt-4 border-t border-brand-50 flex justify-between items-center">
          <span className="text-lg font-bold text-ink-900">Total</span>
          <span className="text-2xl font-extrabold text-brand-700">
            {formatINR(total)}
          </span>
        </div>
      </div>

      {/* Payment method */}
      <div className="mt-7">
        <h4 className="text-base font-bold text-ink-900 mb-3">
          Payment Method
        </h4>

        <div className="space-y-3">
          {/* COD */}
          <label
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition",
              paymentMethod === "cod"
                ? "border-brand-600 bg-brand-50/50"
                : "border-brand-100 hover:border-brand-300"
            )}
          >
            <input
              type="radio"
              name="payment_method_ui"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => onPaymentMethodChange("cod")}
              className="h-4 w-4 accent-blue-600"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-ink-900">
                Cash on Delivery
              </p>
              <p className="text-xs text-ink-500 mt-0.5">
                Pay when you receive
              </p>
            </div>
            <Banknote className="h-5 w-5 text-ink-400" />
          </label>

          {/* Card (disabled) */}
          <label
            className={cn(
              "flex items-center gap-3 rounded-xl border-2 p-4 cursor-not-allowed opacity-60",
              "border-brand-100"
            )}
          >
            <input
              type="radio"
              name="payment_method_ui"
              value="card"
              disabled
              className="h-4 w-4"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-ink-400">
                UPI / Card / Netbanking
              </p>
              <p className="text-xs text-accent-500 mt-0.5 font-medium">
                Feature available soon
              </p>
            </div>
            <CreditCard className="h-5 w-5 text-ink-300" />
          </label>
        </div>
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={isPlacing}
        className={cn(
          "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white transition",
          "bg-brand-600 hover:bg-brand-700 active:scale-[0.99] shadow-card",
          isPlacing && "opacity-70 cursor-wait"
        )}
      >
        <Package className="h-5 w-5" />
        {isPlacing ? "Placing order..." : "Place Order (COD)"}
      </button>

      <p className="mt-3 text-[11px] text-ink-500 text-center leading-relaxed">
        By placing this order you agree to pay the total amount on delivery.
      </p>
    </div>
  );
}