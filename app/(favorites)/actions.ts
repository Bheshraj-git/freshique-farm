"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ToggleFavoriteResult {
  ok: boolean;
  favorited?: boolean;
  error?: string;
}

export async function toggleFavoriteAction(
  productId: string
): Promise<ToggleFavoriteResult> {
  if (!productId || !/^[0-9a-f-]{36}$/i.test(productId)) {
    return { ok: false, error: "Invalid product id" };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "NOT_AUTHENTICATED" };
  }

  // Check current state
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    // Remove
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/favorites");
    revalidatePath("/market");
    revalidatePath(`/product/${productId}`);

    return { ok: true, favorited: false };
  }

  // Add
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, product_id: productId });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/favorites");
  revalidatePath("/market");
  revalidatePath(`/product/${productId}`);

  return { ok: true, favorited: true };
}