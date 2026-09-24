"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
};

export interface OrderActionResult {
    ok: boolean;
    error?: string;
}

/**
 * Updates the status of an order that includes products from this farmer.
 * RLS already restricts which orders the farmer can see; we also validate
 * that the transition is allowed by the state machine.
 */
export async function updateOrderStatusAction(
    orderId: string,
    nextStatus: string
): Promise<OrderActionResult> {
    if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
        return { ok: false, error: "Invalid order" };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Not authenticated" };

    // Fetch current status
    const { data: order } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .maybeSingle();

    if (!order) return { ok: false, error: "Order not found" };

    const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(nextStatus)) {
        return {
            ok: false,
            error: `Cannot move from "${order.status}" to "${nextStatus}"`,
        };
    }

    // If cancelling, restore stock for this farmer's items
    if (nextStatus === "cancelled") {
        const { data: items } = await supabase
            .from("order_items")
            .select("product_id, quantity, farmer_id")
            .eq("order_id", orderId);

        for (const it of items ?? []) {
            if (it.product_id && it.farmer_id === user.id) {
                const { data: p } = await supabase
                    .from("products")
                    .select("stock")
                    .eq("id", it.product_id)
                    .maybeSingle();
                if (p) {
                    await supabase
                        .from("products")
                        .update({ stock: Number(p.stock) + Number(it.quantity) })
                        .eq("id", it.product_id);
                }
            }
        }
    }

    const { error } = await supabase
        .from("orders")
        .update({ status: nextStatus })
        .eq("id", orderId);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/farmer/dashboard/orders");
    revalidatePath(`/farmer/dashboard/orders/${orderId}`);
    revalidatePath("/orders");
    return { ok: true };
}