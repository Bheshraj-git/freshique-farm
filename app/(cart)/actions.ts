"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CartActionResult {
  ok: boolean;
  error?: string;
  lineId?: string;
}

/**
 * Add a product to the cart, or increment if it already exists.
 * Enforces: authenticated consumer, stock > 0, active product.
 */
export async function addToCartAction(
  productId: string,
  quantity = 1
): Promise<CartActionResult> {
  if (!productId || !/^[0-9a-f-]{36}$/i.test(productId)) {
    return { ok: false, error: "Invalid product" };
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { ok: false, error: "Invalid quantity" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "NOT_AUTHENTICATED" };

  // Verify the user is a consumer
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "farmer") {
    return { ok: false, error: "FARMER_NOT_ALLOWED" };
  }

  // Load product to verify stock + active
  const { data: product } = await supabase
    .from("products")
    .select("id, stock, is_active")
    .eq("id", productId)
    .maybeSingle();

  if (!product || !product.is_active) {
    return { ok: false, error: "Product is not available" };
  }
  if (Number(product.stock) <= 0) {
    return { ok: false, error: "Product is out of stock" };
  }

  // Existing line?
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const nextQty = Number(existing.quantity) + quantity;
    if (nextQty > Number(product.stock)) {
      return { ok: false, error: "Only limited stock available" };
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: nextQty })
      .eq("id", existing.id);

    if (error) return { ok: false, error: error.message };

    revalidateCartPaths(productId);
    return { ok: true, lineId: existing.id };
  }

  // New line
  if (quantity > Number(product.stock)) {
    return { ok: false, error: "Only limited stock available" };
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not add to cart" };
  }

  revalidateCartPaths(productId);
  return { ok: true, lineId: data.id };
}

/**
 * Update the quantity of a cart line. quantity = 0 removes the line.
 */
export async function updateCartQuantityAction(
  lineId: string,
  quantity: number
): Promise<CartActionResult> {
  if (!lineId || !/^[0-9a-f-]{36}$/i.test(lineId)) {
    return { ok: false, error: "Invalid cart line" };
  }
  if (!Number.isFinite(quantity) || quantity < 0) {
    return { ok: false, error: "Invalid quantity" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "NOT_AUTHENTICATED" };

  // Verify ownership + get product stock
  const { data: line } = await supabase
    .from("cart_items")
    .select("id, product_id, product:products(id, stock)")
    .eq("id", lineId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!line) return { ok: false, error: "Cart line not found" };

  if (quantity === 0) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", lineId);
    if (error) return { ok: false, error: error.message };
    revalidateCartPaths((line as any).product_id);
    return { ok: true };
  }

  const stock = Number((line as any).product?.stock ?? 0);
  if (quantity > stock) {
    return { ok: false, error: `Only ${stock} in stock` };
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", lineId);

  if (error) return { ok: false, error: error.message };
  revalidateCartPaths((line as any).product_id);
  return { ok: true };
}

/**
 * Remove a line.
 */
export async function removeCartLineAction(
  lineId: string
): Promise<CartActionResult> {
  if (!lineId || !/^[0-9a-f-]{36}$/i.test(lineId)) {
    return { ok: false, error: "Invalid cart line" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "NOT_AUTHENTICATED" };

  const { data: line } = await supabase
    .from("cart_items")
    .select("product_id")
    .eq("id", lineId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!line) return { ok: false, error: "Cart line not found" };

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", lineId);

  if (error) return { ok: false, error: error.message };
  revalidateCartPaths(line.product_id);
  return { ok: true };
}

/**
 * Empty the cart.
 */
export async function clearCartAction(): Promise<CartActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "NOT_AUTHENTICATED" };

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  revalidateCartPaths();
  return { ok: true };
}

function revalidateCartPaths(productId?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  if (productId) revalidatePath(`/product/${productId}`);
}   