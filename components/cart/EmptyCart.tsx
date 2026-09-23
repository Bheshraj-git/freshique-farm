import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <ShoppingCart
        className="h-24 w-24 text-brand-400 mb-6"
        strokeWidth={1.2}
      />
      <h2 className="text-3xl md:text-4xl font-extrabold text-ink-900 mb-3">
        Your cart is empty
      </h2>
      <p className="text-base text-ink-500 mb-8">
        Add fresh farm products to get started!
      </p>
      <Link href="/market">
        <Button size="lg">
          Browse Market
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}