import { createClient } from "@/lib/supabase/server";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (error) {
    console.error("getCategories error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCities(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("city")
    .eq("is_active", true);

  if (error || !data) return [];

  const unique = Array.from(new Set(data.map((r) => r.city).filter(Boolean)));
  unique.sort();
  return unique;
}