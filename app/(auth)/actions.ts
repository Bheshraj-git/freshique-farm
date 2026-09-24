"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";

export interface ActionState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Sign in with email + password.
 * Returns success; the client handles navigation.
 */
export async function signInAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
    role: (String(formData.get("role") || "consumer") as "consumer" | "farmer"),
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      error:
        error.message === "Invalid login credentials"
          ? "Invalid email or password"
          : error.message,
    };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Sign up — creates auth user, uploads avatar, returns success.
 */
export async function signUpAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    full_name: String(formData.get("full_name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
    role: (String(formData.get("role") || "consumer") as "consumer" | "farmer"),
    phone: String(formData.get("phone") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    state: String(formData.get("state") || "").trim(),
    country: String(formData.get("country") || "").trim(),
    zip_code: String(formData.get("zip_code") || "").trim(),
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        role: parsed.data.role,
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city,
        state: parsed.data.state,
        country: parsed.data.country,
        zip_code: parsed.data.zip_code,
      },
    },
  });

  if (authError) {
    return {
      ok: false,
      error:
        authError.message.includes("already registered") ||
        authError.message.includes("already exists")
          ? "An account with this email already exists"
          : authError.message,
    };
  }

  const newUser = authData.user;
  if (!newUser) {
    return { ok: false, error: "Signup succeeded but no user was returned." };
  }

  const file = formData.get("avatar") as File | null;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const allowed = ["jpg", "jpeg", "png", "webp"];
    if (allowed.includes(ext) && file.size <= 2 * 1024 * 1024) {
      const path = `${newUser.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);

        await supabase
          .from("profiles")
          .update({ avatar_url: urlData.publicUrl })
          .eq("id", newUser.id);
      }
    }
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Sign out — clears session, returns void.
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}