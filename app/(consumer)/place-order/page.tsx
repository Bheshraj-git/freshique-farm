import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getCartLines } from "@/lib/queries/cart";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Checkout — Freshique Farm",
};

export default async function PlaceOrderPage() {
  const { profile } = await requireAuth("/place-order");
  const lines = await getCartLines();

  // No cart → bounce back to /cart
  if (lines.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-ink-900 mb-6 md:mb-10">
        Checkout
      </h1>

      <CheckoutForm
        lines={lines}
        defaultAddress={profile.address ?? ""}
        city={profile.city ?? ""}
        state={profile.state ?? ""}
        zipCode={profile.zip_code ?? ""}
        country={profile.country ?? ""}
      />
    </div>
  );
}