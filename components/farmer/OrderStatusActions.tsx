"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Truck, X, PackageCheck } from "lucide-react";
import { updateOrderStatusAction } from "@/app/farmer/dashboard/orders/actions";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface Props {
    orderId: string;
    currentStatus: string;
}

const NEXT: Record<string, { status: string; label: string; icon: any; tone: "primary" | "danger" | "success" }[]> = {
    pending: [
        { status: "confirmed", label: "Confirm Order", icon: Check, tone: "primary" },
        { status: "cancelled", label: "Cancel", icon: X, tone: "danger" },
    ],
    confirmed: [
        { status: "processing", label: "Start Processing", icon: Truck, tone: "primary" },
        { status: "cancelled", label: "Cancel", icon: X, tone: "danger" },
    ],
    processing: [
        { status: "completed", label: "Mark Completed", icon: PackageCheck, tone: "success" },
        { status: "cancelled", label: "Cancel", icon: X, tone: "danger" },
    ],
    completed: [],
    cancelled: [],
};

export default function OrderStatusActions({ orderId, currentStatus }: Props) {
    const router = useRouter();
    const { push } = useToast();
    const [busy, setBusy] = useState<string | null>(null);

    const actions = NEXT[currentStatus] ?? [];
    if (actions.length === 0) {
        return (
            <p className="text-sm text-ink-500 italic">
                This order is {currentStatus}. No further actions available.
            </p>
        );
    }

    async function handle(status: string) {
        setBusy(status);
        const result = await updateOrderStatusAction(orderId, status);
        setBusy(null);
        if (!result.ok) {
            push("error", result.error || "Could not update order");
            return;
        }
        push("success", `Order marked as ${status}`);
        router.refresh();
    }

    return (
        <div className="flex flex-wrap gap-3">
            {actions.map(({ status, label, icon: Icon, tone }) => (
                <button
                    key={status}
                    type="button"
                    onClick={() => handle(status)}
                    disabled={!!busy}
                    className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition shadow-card",
                        tone === "primary" && "bg-brand-600 text-white hover:bg-brand-700",
                        tone === "success" && "bg-emerald-600 text-white hover:bg-emerald-700",
                        tone === "danger" &&
                        "bg-white border border-danger-500/30 text-danger-600 hover:bg-danger-500/5",
                        busy === status && "opacity-60 cursor-wait"
                    )}
                >
                    <Icon className="h-4 w-4" />
                    {busy === status ? "Working..." : label}
                </button>
            ))}
        </div>
    );
}