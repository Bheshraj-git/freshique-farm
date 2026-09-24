import { createClient } from "@/lib/supabase/server";

export interface FarmerProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    unit: string;
    stock: number;
    city: string;
    is_active: boolean;
    created_at: string;
    category_name: string | null;
    primary_image: string | null;
}

export async function getFarmerProducts(
    farmerId: string
): Promise<FarmerProduct[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select(
            `
      id,
      name,
      slug,
      price,
      unit,
      stock,
      city,
      is_active,
      created_at,
      category:categories(name),
      images:product_images(url, position)
    `
        )
        .eq("farmer_id", farmerId)
        .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => {
        const images = Array.isArray(row.images) ? row.images : [];
        images.sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            price: Number(row.price),
            unit: row.unit,
            stock: Number(row.stock),
            city: row.city,
            is_active: row.is_active,
            created_at: row.created_at,
            category_name: row.category?.name ?? null,
            primary_image: images[0]?.url ?? null,
        };
    });
}

export interface FarmerOrderListItem {
    id: string;
    status: string;
    total: number;
    created_at: string;
    buyer_name: string;
    my_item_count: number;
    my_item_preview: string | null;
    my_item_image: string | null;
}

/**
 * Returns orders that include at least one product from this farmer,
 * with a preview of the farmer's items in each.
 */
export async function getFarmerOrders(
    farmerId: string
): Promise<FarmerOrderListItem[]> {
    const supabase = await createClient();

    // Get order ids where this farmer has items
    const { data: myItems, error } = await supabase
        .from("order_items")
        .select(
            `
      order_id,
      product_name,
      product_image,
      quantity,
      order:orders(id, status, total, created_at, user_id)
    `
        )
        .eq("farmer_id", farmerId);

    if (error || !myItems || myItems.length === 0) return [];

    // Group by order id
    const byOrder = new Map<string, any>();
    for (const item of myItems) {
        const o = (item as any).order;
        if (!o) continue;
        if (!byOrder.has(o.id)) {
            byOrder.set(o.id, {
                id: o.id,
                status: o.status,
                total: Number(o.total),
                created_at: o.created_at,
                user_id: o.user_id,
                items: [],
            });
        }
        byOrder.get(o.id).items.push(item);
    }

    const orders = Array.from(byOrder.values());

    // Fetch buyer names
    const buyerIds = Array.from(new Set(orders.map((o) => o.user_id)));
    const { data: buyers } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", buyerIds);

    const buyerMap = new Map((buyers ?? []).map((b) => [b.id, b.full_name]));

    return orders
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((o) => ({
            id: o.id,
            status: o.status,
            total: o.total,
            created_at: o.created_at,
            buyer_name: buyerMap.get(o.user_id) ?? "Customer",
            my_item_count: o.items.reduce(
                (sum: number, it: any) => sum + Number(it.quantity),
                0
            ),
            my_item_preview: o.items[0]?.product_name ?? null,
            my_item_image: o.items[0]?.product_image ?? null,
        }));
}

export interface FarmerOrderDetail {
    id: string;
    status: string;
    total: number;
    subtotal: number;
    delivery_fee: number;
    shipping_address: string;
    created_at: string;
    buyer_name: string;
    buyer_email: string | null;
    my_items: {
        id: string;
        product_id: string | null;
        product_name: string;
        product_unit: string;
        product_image: string | null;
        quantity: number;
        unit_price: number;
        subtotal: number;
    }[];
}

export async function getFarmerOrderDetail(
    orderId: string,
    farmerId: string
): Promise<FarmerOrderDetail | null> {
    if (!/^[0-9a-f-]{36}$/i.test(orderId)) return null;

    const supabase = await createClient();

    const { data: order } = await supabase
        .from("orders")
        .select(
            `
      id,
      status,
      total,
      subtotal,
      delivery_fee,
      shipping_address,
      created_at,
      user_id,
      order_items(
        id, product_id, product_name, product_unit, product_image,
        quantity, unit_price, subtotal, farmer_id
      )
    `
        )
        .eq("id", orderId)
        .maybeSingle();

    if (!order) return null;

    const myItems = ((order as any).order_items ?? []).filter(
        (it: any) => it.farmer_id === farmerId
    );
    if (myItems.length === 0) return null;

    // Fetch buyer
    const { data: buyer } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", (order as any).user_id)
        .maybeSingle();

    const { data: authUser } = await supabase.auth.admin?.getUserById?.(
        (order as any).user_id
    ) ?? { data: null };

    return {
        id: order.id,
        status: order.status,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        delivery_fee: Number(order.delivery_fee),
        shipping_address: order.shipping_address,
        created_at: order.created_at,
        buyer_name: buyer?.full_name ?? "Customer",
        buyer_email: null,
        my_items: myItems.map((it: any) => ({
            id: it.id,
            product_id: it.product_id,
            product_name: it.product_name,
            product_unit: it.product_unit,
            product_image: it.product_image,
            quantity: Number(it.quantity),
            unit_price: Number(it.unit_price),
            subtotal: Number(it.subtotal),
        })),
    };
}