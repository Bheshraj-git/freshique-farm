"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle } from "lucide-react";
import { cancelOrderAction } from "@/app/(orders)/actions";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface Props {
  orderId: string;
}

export default function CancelOrderButton({ orderId }: Props) {
  const router = useRouter();
  const { push } = useToast();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleCancel() {
    setBusy(true);
    const form = new FormData();
    form.set("orderId", orderId);
    await cancelOrderAction(form);
    push("success", "Order cancelled");
    router.refresh();
    setBusy(false);
    setConfirm(false);
  }

  if (!confirm) {
    return (
      <button
        type="button"
        onClick={() => setConfirm(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-danger-500/30 bg-white px-4 py-2.5 text-sm font-bold text-danger-600 hover:bg-danger-500/5 transition"
      >
        <X className="h-4 w-4" />
        Cancel Order
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-danger-500/10 border border-danger-500/30 p-4">
      <div className="flex items-start gap-3 mb-3">
        <AlertTriangle className="h-5 w-5 text-danger-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-danger-600">
            Cancel this order?
          </p>
          <p className="text-xs text-ink-700 mt-1">
            This will restore the items to stock. You can&apos;t undo this.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={busy}
          className={cn(
            "rounded-xl bg-danger-600 px-4 py-2 text-sm font-bold text-white hover:bg-danger-500 transition",
            busy && "opacity-60 cursor-wait"
          )}
        >
          {busy ? "Cancelling..." : "Yes, cancel"}
        </button>
        <button
          type="button"
          onClick={() => setConfirm(false)}
          disabled={busy}
          className="rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50 transition"
        >
          Keep order
        </button>
      </div>
    </div>
  );
}