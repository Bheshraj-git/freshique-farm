import { createClient } from "@/lib/supabase/server";
import type { ProductCard } from "./products";

/**
 * Returns the set of product IDs the current user has favorited.
 * Empty set for anonymous users or on error.
 */
export async function getFavoritedProductIds(): Promise<Set<string>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", user.id);

  if (error || !data) return new Set();
  return new Set(data.map((r) => r.product_id));
}

/**
 * Returns the full product rows for a user's favorites, newest first.
 * Used on /favorites and the profile Saved Items preview.
 */
export async function getFavoriteProducts(): Promise<ProductCard[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // Two queries: get favorite product IDs (ordered by when saved),
  // then fetch the corresponding product rows with their images/category.
  const { data: favRows, error: favError } = await supabase
    .from("favorites")
    .select("product_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (favError || !favRows || favRows.length === 0) return [];

  const productIds = favRows.map((r) => r.product_id);

  const { data: products, error: prodError } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      unit,
      city,
      is_active,
      category:categories(id, name, slug),
      images:product_images(url, position)
    `
    )
    .in("id", productIds)
    .eq("is_active", true);

  if (prodError || !products) return [];

  // Preserve favorites ordering (newest saved first)
  const byId = new Map(products.map((p: any) => [p.id, p]));
  const ordered = productIds
    .map((id) => byId.get(id))
    .filter((p): p is any => Boolean(p));

  // Shape into ProductCard
  return ordered.map((row) => {
    const images = Array.isArray(row.images) ? row.images : [];
    images.sort(
      (a: any, b: any) => (a.position ?? 0) - (b.position ?? 0)
    );
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      price: Number(row.price),
      unit: row.unit,
      city: row.city,
      category_name: row.category?.name ?? null,
      category_slug: row.category?.slug ?? null,
      primary_image: images[0]?.url ?? null,
    };
  });
}

/**
 * Count of favorites for the current user. Used on /profile.
 */
export async function getFavoriteCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) return 0;
  return count ?? 0;
}