import Link from "next/link";
import { PackageX } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="mx-auto grid place-items-center h-20 w-20 rounded-2xl bg-brand-50 text-brand-400 mb-6">
        <PackageX className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <h1 className="text-3xl font-extrabold text-ink-900 mb-3">
        Product not found
      </h1>
      <p className="text-ink-500 mb-8">
        This product may have been removed or is no longer available.
      </p>
      <Link href="/market">
        <Button>Back to Market</Button>
      </Link>
    </div>
  );
}