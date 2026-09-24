"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface PlaceOrderState {
  ok: boolean;
  orderId?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function placeOrderAction(
  _prev: PlaceOrderState,
  formData: FormData
): Promise<PlaceOrderState> {
  const shipping_address = String(formData.get("shipping_address") || "").trim();
  const payment_method = String(formData.get("payment_method") || "cod").trim();

  if (!shipping_address) {
    return {
      ok: false,
      fieldErrors: { shipping_address: "Shipping address is required" },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please log in to place an order." };
  }

  // Fetch cart items
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      product_id,
      product:products(
        id,
        name,
        price,
        unit,
        stock,
        farmer_id,
        is_active,
        images:product_images(url, position)
      )
    `)
    .eq("user_id", user.id);

  if (cartError || !cartItems || cartItems.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const DELIVERY_FEE = 30;
  let subtotal = 0;

  for (const item of cartItems) {
    const p = item.product as any;
    if (!p || !p.is_active) {
      return { ok: false, error: "One or more products in your cart is currently unavailable." };
    }
    if (Number(p.stock) < Number(item.quantity)) {
      return {
        ok: false,
        error: `Insufficient stock for "${p.name}". Only ${p.stock} available.`,
      };
    }
    subtotal += Number(p.price) * Number(item.quantity);
  }

  const total = subtotal + DELIVERY_FEE;

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      subtotal,
      delivery_fee: DELIVERY_FEE,
      total,
      shipping_address,
      notes: payment_method,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: orderError?.message || "Failed to create order." };
  }

  // Insert order items
  const orderItemsToInsert = cartItems.map((item) => {
    const p = item.product as any;
    const images = Array.isArray(p.images) ? p.images : [];
    images.sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
    const unitPrice = Number(p.price);
    const qty = Number(item.quantity);

    return {
      order_id: order.id,
      product_id: p.id,
      product_name: p.name,
      product_unit: p.unit,
      product_image: images[0]?.url ?? null,
      quantity: qty,
      unit_price: unitPrice,
      subtotal: unitPrice * qty,
      farmer_id: p.farmer_id ?? null,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsToInsert);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { ok: false, error: itemsError.message || "Failed to save order items." };
  }

  // Decrement stock
  for (const item of cartItems) {
    const p = item.product as any;
    await supabase
      .from("products")
      .update({ stock: Math.max(0, Number(p.stock) - Number(item.quantity)) })
      .eq("id", p.id);
  }

  // Clear cart
  await supabase.from("cart_items").delete().eq("user_id", user.id);

  revalidatePath("/cart");
  revalidatePath("/orders");
  revalidatePath(`/orders/${order.id}`);
  revalidatePath("/", "layout");

  return { ok: true, orderId: order.id };
}

export async function cancelOrderAction(formData: FormData): Promise<void> {
  const orderId = String(formData.get("orderId") || "");
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: order } = await supabase
    .from("orders")
    .select(
      `id, user_id, status, order_items(id, product_id, quantity, farmer_id)`
    )
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.user_id !== user.id || order.status !== "pending") {
    return;
  }

  // Restore stock
  const items = order.order_items ?? [];
  for (const it of items) {
    if (it.product_id) {
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

  await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/", "layout");
}