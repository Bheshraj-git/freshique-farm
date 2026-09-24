import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function EmptyOrders() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-white/50 px-6 py-20 text-center">
      <div className="mx-auto grid place-items-center h-20 w-20 rounded-2xl bg-brand-50 text-brand-300 mb-5">
        <Package className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-bold text-ink-900 mb-2">
        No orders yet
      </h2>
      <p className="text-sm text-ink-500 mb-6 max-w-sm mx-auto">
        When you place an order, it will show up here so you can track its
        progress.
      </p>
      <Link href="/market">
        <Button>
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}