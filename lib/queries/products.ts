import { createClient } from "@/lib/supabase/server";

export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit: string;
  city: string;
  category_name: string | null;
  category_slug: string | null;
  primary_image: string | null;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  unit: string;
  stock: number;
  city: string;
  category_id: string | null;
  category_name: string | null;
  category_slug: string | null;
  farmer_id: string;
  farmer_name: string;
  farmer_avatar: string | null;
  images: string[];
}

export interface ProductFilters {
  q?: string;
  city?: string;
  category?: string;
  min?: number;
  max?: number;
  limit?: number;
  offset?: number;
}

const PRODUCT_SELECT = `
  id,
  name,
  slug,
  price,
  unit,
  city,
  category:categories(id, name, slug),
  images:product_images(url, position)
`;

function shapeCard(row: any): ProductCard {
  const images = Array.isArray(row.images) ? row.images : [];
  images.sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
  const primary = images[0]?.url ?? null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    unit: row.unit,
    city: row.city,
    category_name: row.category?.name ?? null,
    category_slug: row.category?.slug ?? null,
    primary_image: primary,
  };
}

export async function listProducts(filters: ProductFilters = {}) {
  const supabase = await createClient();
  const limit = filters.limit ?? 24;
  const offset = filters.offset ?? 0;

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .eq("is_active", true);

  if (filters.q) {
    query = query.ilike("name", `%${filters.q}%`);
  }
  if (filters.city) {
    query = query.eq("city", filters.city);
  }
  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .maybeSingle();
    if (cat?.id) {
      query = query.eq("category_id", cat.id);
    } else {
      return { products: [], count: 0 };
    }
  }
  if (typeof filters.min === "number") {
    query = query.gte("price", filters.min);
  }
  if (typeof filters.max === "number") {
    query = query.lte("price", filters.max);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("listProducts error:", error.message);
    return { products: [], count: 0 };
  }

  return {
    products: (data ?? []).map(shapeCard),
    count: count ?? 0,
  };
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  // Guard against obviously invalid ids (uuid shape)
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      description,
      price,
      unit,
      stock,
      city,
      is_active,
      farmer_id,
      category:categories(id, name, slug),
      images:product_images(url, position),
      farmer:profiles(id, full_name, avatar_url)
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  if (!data.is_active) return null;

  const images = (data.images ?? [])
    .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
    .map((i: any) => i.url);

  const farmer = (data as any).farmer as
    | { full_name: string; avatar_url: string | null }
    | null;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: Number(data.price),
    unit: data.unit,
    stock: Number(data.stock),
    city: data.city,
    category_id: (data as any).category?.id ?? null,
    category_name: (data as any).category?.name ?? null,
    category_slug: (data as any).category?.slug ?? null,
    farmer_id: data.farmer_id,
    farmer_name: farmer?.full_name ?? "Unknown Farmer",
    farmer_avatar: farmer?.avatar_url ?? null,
    images,
  };
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string,
  limit = 4
): Promise<ProductCard[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getRelatedProducts error:", error.message);
    return [];
  }
  return (data ?? []).map(shapeCard);
}