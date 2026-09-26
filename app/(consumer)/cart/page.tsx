import { requireAuth } from "@/lib/auth";
import { getCartLines } from "@/lib/queries/cart";
import CartItemsList from "@/components/cart/CartItemsList";
import CartSummary from "@/components/cart/CartSummary";

export const metadata = {
  title: "Cart — Freshique Farm",
};

export default async function CartPage() {
  await requireAuth("/cart");

  const lines = await getCartLines();
  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.quantity,
    0
  );
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
        <CartItemsList initialItems={[]} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 mb-4 md:mb-8">
        Your Cart
      </h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <CartItemsList initialItems={lines} />
        </div>
        <aside>
          <CartSummary subtotal={subtotal} itemCount={itemCount} />
        </aside>
      </div>
    </div>
  );
}