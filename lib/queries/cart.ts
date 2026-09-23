import { createClient } from "@/lib/supabase/server";

export interface CartItemWithProduct {
  id: string;                // cart_items.id
  product_id: string;
  quantity: number;
  product_name: string;
  product_slug: string;
  product_price: number;
  product_unit: string;
  product_city: string;
  product_stock: number;
  product_image: string | null;
  farmer_name: string | null;
}

export interface CartLine {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    unit: string;
    city: string;
    stock: number;
    image: string | null;
    farmer_name: string | null;
  };
}

const CART_SELECT = `
  id,
  quantity,
  product_id,
  product:products(
    id,
    name,
    slug,
    price,
    unit,
    city,
    stock,
    is_active,
    farmer_id,
    category:categories(id, name, slug),
    images:product_images(url, position),
    farmer:profiles(id, full_name, avatar_url)
  )
`;

function shapeLine(row: any): CartLine | null {
  const p = row.product;
  if (!p || !p.is_active) return null;

  const images = Array.isArray(p.images) ? p.images : [];
  images.sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));

  return {
    id: row.id,
    product_id: row.product_id,
    quantity: Number(row.quantity),
    product: {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      unit: p.unit,
      city: p.city,
      stock: Number(p.stock),
      image: images[0]?.url ?? null,
      farmer_name: p.farmer?.full_name ?? null,
    },
  };
}

export async function getCartLines(): Promise<CartLine[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("cart_items")
    .select(CART_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(shapeLine).filter((x): x is CartLine => x !== null);
}

export async function getCartCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data, error } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("user_id", user.id);

  if (error || !data) return 0;
  // Total count = sum of quantities
  return data.reduce((sum, r) => sum + Number(r.quantity), 0);
}