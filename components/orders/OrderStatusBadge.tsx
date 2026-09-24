import Badge from "@/components/ui/Badge";
import type { OrderStatus } from "@/lib/queries/orders";

const map: Record<
  OrderStatus,
  { label: string; tone: "brand" | "accent" | "success" | "warn" | "danger" | "neutral" }
> = {
  pending: { label: "Pending", tone: "warn" },
  confirmed: { label: "Confirmed", tone: "brand" },
  processing: { label: "Processing", tone: "accent" },
  completed: { label: "Completed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, tone } = map[status] ?? map.pending;
  return (
    <Badge tone={tone} size="md">
      {label}
    </Badge>
  );
}
