import { Heart, PackageOpen } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface Props {
  count: number;
  children?: React.ReactNode;
}

export default function SavedItemsSection({ count, children }: Props) {
  return (
    <section className="mt-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Heart
            className="h-5 w-5 text-danger-600"
            fill="currentColor"
            strokeWidth={0}
          />
          <h2 className="text-lg font-bold text-ink-900">Saved Items</h2>
        </div>
        <Badge tone="neutral" size="md">
          {count} {count === 1 ? "Item" : "Items"}
        </Badge>
      </div>

      {/* Content */}
      {count === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-white/50 px-6 py-16 text-center">
          <div className="mx-auto grid place-items-center h-16 w-16 rounded-2xl bg-brand-50 text-brand-300 mb-4">
            <PackageOpen className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <p className="text-base font-bold text-ink-900">
            No favorites yet
          </p>
          <p className="text-sm text-ink-500 mt-1 max-w-xs mx-auto">
            Items you save will appear here for quick access.
          </p>
        </div>
      ) : (
        children
      )}
    </section>
  );
}