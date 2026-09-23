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
      <div className="mx-auto max-w-3xl px-6 py-6">
        <CartItemsList initialItems={[]} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <h1 className="text-3xl font-extrabold text-ink-900 mb-8">
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