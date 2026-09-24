"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, ImageOff } from "lucide-react";
import { placeOrderAction, type PlaceOrderState } from "@/app/(orders)/actions";
import type { CartLine } from "@/lib/queries/cart";
import { useToast } from "@/lib/toast";
import OrderSummaryCard from "./OrderSummaryCard";
import DeliveryAddressCard from "./DeliveryAddressCard";
import CheckoutItemRow from "./CheckoutItemRow";
import { formatINR } from "@/lib/utils";

const initialState: PlaceOrderState = { ok: false };

interface Props {
  lines: CartLine[];
  defaultAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const DELIVERY_FEE = 30;

export default function CheckoutForm({
  lines,
  defaultAddress,
  city,
  state,
  zipCode,
  country,
}: Props) {
  const router = useRouter();
  const { push } = useToast();

  const [formState, formAction, isPending] = useActionState(
    placeOrderAction,
    initialState
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [address, setAddress] = useState(defaultAddress);

  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.quantity,
    0
  );
  const total = subtotal + DELIVERY_FEE;

  // Navigate to the order page on success
  useEffect(() => {
    if (formState.ok && formState.orderId) {
      push("success", "Order placed successfully");
      router.push(`/orders/${formState.orderId}?placed=1`);
      router.refresh();
    }
  }, [formState.ok, formState.orderId, push, router]);

  // Build the full address string that goes to the server
  const fullAddress = [address, city, state, zipCode, country]
    .filter(Boolean)
    .join(", ");

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* Hidden inputs carry form state to the server */}
      <input type="hidden" name="shipping_address" value={fullAddress} />
      <input type="hidden" name="payment_method" value={paymentMethod} />

      {/* ===== LEFT COLUMN ===== */}
      <div className="space-y-6">
        {/* Your Fresh Items */}
        <section className="rounded-2xl bg-white border border-brand-50 shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-brand-100 text-brand-700">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold text-ink-900">
              Your Fresh Items
            </h2>
          </div>

          <div className="space-y-3">
            {lines.map((line) => (
              <CheckoutItemRow key={line.id} line={line} />
            ))}
          </div>
        </section>

        {/* Delivery Address */}
        <DeliveryAddressCard
          initialAddress={defaultAddress}
          city={city}
          state={state}
          zipCode={zipCode}
          country={country}
          onAddressChange={setAddress}
        />

        {/* Address error (if server rejects) */}
        {formState.fieldErrors?.shipping_address && (
          <p className="rounded-xl bg-danger-500/10 text-danger-600 px-4 py-3 text-sm font-medium">
            {formState.fieldErrors.shipping_address}
          </p>
        )}
      </div>

      {/* ===== RIGHT COLUMN ===== */}
      <aside>
        {/* Server-side error banner */}
        {formState.error && !formState.fieldErrors && (
          <div className="mb-4 rounded-xl bg-danger-500/10 text-danger-600 px-4 py-3 text-sm font-medium">
            {formState.error}
          </div>
        )}

        <OrderSummaryCard
          subtotal={subtotal}
          delivery={DELIVERY_FEE}
          total={total}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          isPlacing={isPending}
        />
      </aside>
    </form>
  );
}