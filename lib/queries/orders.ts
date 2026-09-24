import { createClient } from "@/lib/supabase/server";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";

export interface OrderListItem {
  id: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  delivery_fee: number;
  created_at: string;
  item_count: number;
  preview_image: string | null;
  preview_name: string | null;
}

export interface OrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  product_unit: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  farmer_id: string | null;
}

export interface OrderDetail {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  shipping_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

/**
 * List orders belonging to the current user, newest first.
 * Aggregates item count and a preview product for each.
 */
export async function getUserOrders(): Promise<OrderListItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      subtotal,
      delivery_fee,
      total,
      created_at,
      order_items(
        id,
        product_name,
        product_image,
        quantity
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !orders) return [];

  return orders.map((o: any) => {
    const items = Array.isArray(o.order_items) ? o.order_items : [];
    const itemCount = items.reduce(
      (sum: number, it: any) => sum + Number(it.quantity),
      0
    );
    const preview = items[0] ?? null;

    return {
      id: o.id,
      status: o.status,
      subtotal: Number(o.subtotal),
      delivery_fee: Number(o.delivery_fee),
      total: Number(o.total),
      created_at: o.created_at,
      item_count: itemCount,
      preview_image: preview?.product_image ?? null,
      preview_name: preview?.product_name ?? null,
    };
  });
}

/**
 * Fetch a single order with all items. Access is enforced by RLS:
 * only the consumer who owns it, or a farmer with items in it, can read.
 */
export async function getOrderById(id: string): Promise<OrderDetail | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      user_id,
      status,
      subtotal,
      delivery_fee,
      total,
      shipping_address,
      notes,
      created_at,
      updated_at,
      order_items(
        id,
        product_id,
        product_name,
        product_unit,
        product_image,
        quantity,
        unit_price,
        subtotal,
        farmer_id
      )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const items: OrderItem[] = (data.order_items ?? []).map((it: any) => ({
    id: it.id,
    product_id: it.product_id,
    product_name: it.product_name,
    product_unit: it.product_unit,
    product_image: it.product_image,
    quantity: Number(it.quantity),
    unit_price: Number(it.unit_price),
    subtotal: Number(it.subtotal),
    farmer_id: it.farmer_id,
  }));

  return {
    id: data.id,
    user_id: data.user_id,
    status: data.status as OrderStatus,
    subtotal: Number(data.subtotal),
    delivery_fee: Number(data.delivery_fee),
    total: Number(data.total),
    shipping_address: data.shipping_address,
    notes: data.notes,
    created_at: data.created_at,
    updated_at: data.updated_at,
    items,
  };
}