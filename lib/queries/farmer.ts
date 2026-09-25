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

export interface FarmerAnalyticsData {
    summary: {
        todayRevenue: number;
        todayOrders: number;
        todayAOV: number;
        monthlyRevenue: number;
        monthlyGrowth: number;
        last90DaysRevenue: number;
        totalRevenue: number;
        totalOrders: number;
        uniqueCustomers: number;
    };
    charts: {
        dailySales30Days: { date: string; revenue: number; orders: number }[];
        monthlyRevenueTrend: { month: string; revenue: number }[];
    };
    topProducts: {
        productId: string;
        name: string;
        image: string | null;
        unit: string;
        totalQty: number;
        totalSales: number;
    }[];
    paymentBreakdown: {
        method: string;
        count: number;
        revenue: number;
    }[];
    activeOrderStatus: {
        pending: number;
        confirmed: number;
        preparing: number;
        out_for_delivery: number;
    };
    generatedAt: string;
}

export async function getFarmerAnalytics(
    farmerId: string
): Promise<FarmerAnalyticsData> {
    const supabase = await createClient();

    const { data: myItems, error } = await supabase
        .from("order_items")
        .select(
            `
      id,
      order_id,
      product_id,
      product_name,
      product_image,
      product_unit,
      quantity,
      unit_price,
      subtotal,
      order:orders(id, status, total, created_at, user_id, notes)
    `
        )
        .eq("farmer_id", farmerId);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const days90Ago = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const items = (myItems ?? [])
        .map((it: any) => ({
            ...it,
            order: Array.isArray(it.order) ? it.order[0] : it.order,
        }))
        .filter((it: any) => it.order && it.order.status !== "cancelled");

    // Orders map
    const orderMap = new Map<string, any>();
    for (const it of items) {
        const o = it.order;
        if (!orderMap.has(o.id)) {
            orderMap.set(o.id, {
                ...o,
                farmerTotal: 0,
                items: [],
            });
        }
        const entry = orderMap.get(o.id);
        entry.farmerTotal += Number(it.subtotal);
        entry.items.push(it);
    }
    const allOrders = Array.from(orderMap.values());

    // 1. Summary
    let todayRevenue = 0;
    const todayOrdersSet = new Set<string>();
    let monthlyRevenue = 0;
    let lastMonthRevenue = 0;
    let last90DaysRevenue = 0;
    let totalRevenue = 0;
    const allOrdersSet = new Set<string>();
    const customersSet = new Set<string>();

    for (const it of items) {
        const itemCreatedAt = new Date(it.order.created_at);
        const sub = Number(it.subtotal);

        totalRevenue += sub;
        allOrdersSet.add(it.order_id);
        if (it.order.user_id) customersSet.add(it.order.user_id);

        if (itemCreatedAt >= todayStart) {
            todayRevenue += sub;
            todayOrdersSet.add(it.order_id);
        }

        if (itemCreatedAt >= thisMonthStart) {
            monthlyRevenue += sub;
        } else if (itemCreatedAt >= lastMonthStart && itemCreatedAt <= lastMonthEnd) {
            lastMonthRevenue += sub;
        }

        if (itemCreatedAt >= days90Ago) {
            last90DaysRevenue += sub;
        }
    }

    const todayOrders = todayOrdersSet.size;
    const todayAOV = todayOrders > 0 ? Math.round(todayRevenue / todayOrders) : 0;
    const monthlyGrowth =
        lastMonthRevenue > 0
            ? Number((((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1))
            : monthlyRevenue > 0
                ? 100
                : 0;

    // 2. Charts: 30 days daily
    const dailySalesMap = new Map<string, { revenue: number; orders: Set<string> }>();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        dailySalesMap.set(key, { revenue: 0, orders: new Set() });
    }

    for (const it of items) {
        const key = new Date(it.order.created_at).toISOString().slice(0, 10);
        if (dailySalesMap.has(key)) {
            const entry = dailySalesMap.get(key)!;
            entry.revenue += Number(it.subtotal);
            entry.orders.add(it.order_id);
        }
    }

    const dailySales30Days = Array.from(dailySalesMap.entries()).map(([k, val]) => {
        const d = new Date(k);
        const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return {
            date: dateLabel,
            revenue: Math.round(val.revenue),
            orders: val.orders.size,
        };
    });

    // Monthly Trend: 6 months
    const monthlyTrendMap = new Map<string, { label: string; revenue: number }>();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("en-US", { month: "short" });
        monthlyTrendMap.set(key, { label, revenue: 0 });
    }

    for (const it of items) {
        const d = new Date(it.order.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (monthlyTrendMap.has(key)) {
            monthlyTrendMap.get(key)!.revenue += Number(it.subtotal);
        }
    }

    const monthlyRevenueTrend = Array.from(monthlyTrendMap.values()).map((v) => ({
        month: v.label,
        revenue: Math.round(v.revenue),
    }));

    // 3. Top Products (last 90 days or all-time)
    const productStats = new Map<string, any>();
    const productItemsPool = items.filter((it: any) => new Date(it.order.created_at) >= days90Ago);
    const sourceItems = productItemsPool.length > 0 ? productItemsPool : items;

    for (const it of sourceItems) {
        const pid = it.product_id || it.product_name;
        if (!productStats.has(pid)) {
            productStats.set(pid, {
                productId: pid,
                name: it.product_name,
                image: it.product_image,
                unit: it.product_unit || "kg",
                totalQty: 0,
                totalSales: 0,
            });
        }
        const stat = productStats.get(pid);
        stat.totalQty += Number(it.quantity || 0);
        stat.totalSales += Number(it.subtotal || 0);
    }

    const topProducts = Array.from(productStats.values())
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 10);

    // 4. Payment breakdown
    const paymentMap = new Map<string, { count: number; revenue: number }>();
    for (const o of allOrders) {
        let method = "Cash on Delivery";
        if (o.notes) {
            const lower = o.notes.toLowerCase();
            if (lower.includes("online") || lower.includes("card") || lower.includes("stripe")) {
                method = "Online Payment";
            } else if (lower.includes("upi")) {
                method = "UPI";
            } else if (lower.includes("cod") || lower.includes("cash")) {
                method = "Cash on Delivery";
            } else {
                method = o.notes;
            }
        }
        if (!paymentMap.has(method)) {
            paymentMap.set(method, { count: 0, revenue: 0 });
        }
        const pEntry = paymentMap.get(method)!;
        pEntry.count += 1;
        pEntry.revenue += o.farmerTotal;
    }

    // Default if no payment methods found yet
    if (paymentMap.size === 0) {
        paymentMap.set("Cash on Delivery", { count: 0, revenue: 0 });
        paymentMap.set("Online / UPI", { count: 0, revenue: 0 });
    }

    const paymentBreakdown = Array.from(paymentMap.entries()).map(([method, data]) => ({
        method,
        count: data.count,
        revenue: Math.round(data.revenue),
    }));

    // 5. Active Order Status
    const activeOrderStatus = {
        pending: 0,
        confirmed: 0,
        preparing: 0,
        out_for_delivery: 0,
    };

    for (const o of allOrders) {
        const s = (o.status || "").toLowerCase();
        if (s in activeOrderStatus) {
            activeOrderStatus[s as keyof typeof activeOrderStatus] += 1;
        }
    }

    return {
        summary: {
            todayRevenue: Math.round(todayRevenue),
            todayOrders,
            todayAOV,
            monthlyRevenue: Math.round(monthlyRevenue),
            monthlyGrowth,
            last90DaysRevenue: Math.round(last90DaysRevenue),
            totalRevenue: Math.round(totalRevenue),
            totalOrders: allOrdersSet.size,
            uniqueCustomers: customersSet.size,
        },
        charts: {
            dailySales30Days,
            monthlyRevenueTrend,
        },
        topProducts,
        paymentBreakdown,
        activeOrderStatus,
        generatedAt: now.toISOString(),
    };
}