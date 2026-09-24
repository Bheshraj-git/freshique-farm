"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(2, "Name is required").max(120),
    description: z.string().max(2000).optional().or(z.literal("")),
    price: z.coerce.number().nonnegative("Price must be ≥ 0"),
    unit: z.string().min(1, "Unit is required").max(60),
    stock: z.coerce.number().nonnegative("Stock must be ≥ 0"),
    city: z.string().min(2, "City is required").max(80),
    category_id: z.string().uuid("Choose a category").optional().or(z.literal("")),
    is_active: z.coerce.boolean().optional(),
});

export interface ProductActionResult {
    ok: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
    productId?: string;
    slug?: string;
}

function slugify(name: string) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

/** Verifies the caller is an authenticated farmer. Returns userId or null. */
async function getFarmerId(): Promise<string | null> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    return profile?.role === "farmer" ? user.id : null;
}

/** Uploads a product image to storage/{farmerId}/{productId}/{filename}. */
async function uploadProductImage(
    farmerId: string,
    productId: string,
    file: File
): Promise<{ url?: string; error?: string }> {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
        return { error: "Only JPG, PNG, or WebP allowed" };
    }
    if (file.size > 5 * 1024 * 1024) {
        return { error: "Image must be under 5 MB" };
    }

    const supabase = await createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${farmerId}/${productId}/main.${ext}`;

    const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true, contentType: file.type });

    if (error) return { error: error.message };

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    // Cache-bust the URL so browser picks up the new image on replace
    return { url: `${data.publicUrl}?v=${Date.now()}` };
}

/** Creates a new product for the current farmer. */
export async function createProductAction(
    _prev: ProductActionResult | undefined,
    formData: FormData
): Promise<ProductActionResult> {
    const farmerId = await getFarmerId();
    if (!farmerId) return { ok: false, error: "Not authorized" };

    const raw = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        unit: formData.get("unit"),
        stock: formData.get("stock"),
        city: formData.get("city"),
        category_id: formData.get("category_id") || "",
        is_active: formData.get("is_active") === "on",
    };

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            fieldErrors[issue.path.join(".")] = issue.message;
        }
        return { ok: false, fieldErrors };
    }

    const supabase = await createClient();
    const baseSlug = slugify(parsed.data.name);
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

    const { data, error } = await supabase
        .from("products")
        .insert({
            farmer_id: farmerId,
            name: parsed.data.name,
            slug,
            description: parsed.data.description || null,
            price: parsed.data.price,
            unit: parsed.data.unit,
            stock: parsed.data.stock,
            city: parsed.data.city,
            category_id: parsed.data.category_id || null,
            is_active: parsed.data.is_active ?? true,
        })
        .select("id, slug")
        .single();

    if (error || !data) {
        return { ok: false, error: error?.message || "Could not create product" };
    }

    // Upload image if provided
    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
        const upload = await uploadProductImage(farmerId, data.id, file);
        if (upload.url) {
            await supabase
                .from("product_images")
                .insert({ product_id: data.id, url: upload.url, position: 0 });
        }
    }

    revalidatePath("/farmer/dashboard/products");
    revalidatePath("/market");
    return { ok: true, productId: data.id, slug: data.slug };
}

/** Updates an existing product owned by the current farmer. */
export async function updateProductAction(
    productId: string,
    _prev: ProductActionResult | undefined,
    formData: FormData
): Promise<ProductActionResult> {
    const farmerId = await getFarmerId();
    if (!farmerId) return { ok: false, error: "Not authorized" };
    if (!/^[0-9a-f-]{36}$/i.test(productId)) {
        return { ok: false, error: "Invalid product" };
    }

    const raw = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        unit: formData.get("unit"),
        stock: formData.get("stock"),
        city: formData.get("city"),
        category_id: formData.get("category_id") || "",
        is_active: formData.get("is_active") === "on",
    };

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            fieldErrors[issue.path.join(".")] = issue.message;
        }
        return { ok: false, fieldErrors };
    }

    const supabase = await createClient();

    // Ownership check — RLS also enforces this
    const { data: existing } = await supabase
        .from("products")
        .select("farmer_id")
        .eq("id", productId)
        .maybeSingle();

    if (!existing || existing.farmer_id !== farmerId) {
        return { ok: false, error: "You can only edit your own products" };
    }

    const { error } = await supabase
        .from("products")
        .update({
            name: parsed.data.name,
            description: parsed.data.description || null,
            price: parsed.data.price,
            unit: parsed.data.unit,
            stock: parsed.data.stock,
            city: parsed.data.city,
            category_id: parsed.data.category_id || null,
            is_active: parsed.data.is_active ?? true,
        })
        .eq("id", productId);

    if (error) return { ok: false, error: error.message };

    // If new image, upsert storage + replace product_images row
    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
        const upload = await uploadProductImage(farmerId, productId, file);
        if (upload.url) {
            // Delete existing images then insert one
            await supabase
                .from("product_images")
                .delete()
                .eq("product_id", productId);
            await supabase
                .from("product_images")
                .insert({ product_id: productId, url: upload.url, position: 0 });
        }
    }

    revalidatePath("/farmer/dashboard/products");
    revalidatePath(`/farmer/dashboard/products/${productId}/edit`);
    revalidatePath("/market");
    revalidatePath(`/product/${productId}`);
    return { ok: true, productId };
}

/** Toggles a product's is_active flag. */
export async function toggleProductActiveAction(
    productId: string,
    nextActive: boolean
): Promise<ProductActionResult> {
    const farmerId = await getFarmerId();
    if (!farmerId) return { ok: false, error: "Not authorized" };

    const supabase = await createClient();
    const { error } = await supabase
        .from("products")
        .update({ is_active: nextActive })
        .eq("id", productId)
        .eq("farmer_id", farmerId);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/farmer/dashboard/products");
    revalidatePath("/market");
    return { ok: true };
}

/** Deletes a product permanently. RLS restricts to owner. */
export async function deleteProductAction(
    productId: string
): Promise<ProductActionResult> {
    const farmerId = await getFarmerId();
    if (!farmerId) return { ok: false, error: "Not authorized" };

    const supabase = await createClient();

    // Delete storage objects first (best-effort)
    const { data: images } = await supabase
        .from("product_images")
        .select("url")
        .eq("product_id", productId);

    const storagePaths = (images ?? [])
        .map((i) => {
            try {
                const u = new URL(i.url);
                const parts = u.pathname.split("/product-images/");
                return parts[1] ?? null;
            } catch {
                return null;
            }
        })
        .filter((p): p is string => Boolean(p));

    if (storagePaths.length > 0) {
        await supabase.storage.from("product-images").remove(storagePaths);
    }

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("farmer_id", farmerId);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/farmer/dashboard/products");
    revalidatePath("/market");
    return { ok: true };
}