"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";

export interface ActionState {
  ok: boolean;
  requiresOtp?: boolean;
  email?: string;
  role?: "consumer" | "farmer";
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
    let errorMessage =
      error.message === "Invalid login credentials"
        ? "Invalid email or password"
        : error.message;

    if (error.message.toLowerCase().includes("email not confirmed")) {
      errorMessage =
        "Your email has not been verified yet. Please check your inbox for the verification code or sign up again.";
    }

    return {
      ok: false,
      error: errorMessage,
    };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Sign up — creates auth user, uploads avatar, returns OTP verification state.
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

  // Handle avatar upload if provided
  const file = formData.get("avatar") as File | null;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const allowed = ["jpg", "jpeg", "png", "webp"];
    if (allowed.includes(ext) && file.size <= 2 * 1024 * 1024) {
      try {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        const adminClient = createAdminClient();
        const storageClient = adminClient || supabase;

        const path = `${newUser.id}/avatar.${ext}`;
        const { error: uploadError } = await storageClient.storage
          .from("avatars")
          .upload(path, file, { upsert: true, contentType: file.type });

        if (!uploadError) {
          const { data: urlData } = storageClient.storage
            .from("avatars")
            .getPublicUrl(path);

          await storageClient
            .from("profiles")
            .update({ avatar_url: urlData.publicUrl })
            .eq("id", newUser.id);
        }
      } catch {
        // Non-blocking: failure to upload avatar does not cancel account creation
      }
    }
  }

  // If a session was returned directly, email confirmation is disabled in Supabase
  if (authData.session) {
    revalidatePath("/", "layout");
    return {
      ok: true,
      requiresOtp: false,
      email: parsed.data.email,
      role: parsed.data.role,
    };
  }

  // Otherwise, user needs to verify the 6-digit OTP sent to their email
  return {
    ok: true,
    requiresOtp: true,
    email: parsed.data.email,
    role: parsed.data.role,
  };
}

/**
 * Verifies the 6-digit email OTP with Supabase Auth.
 */
export async function verifyOtpAction(
  email: string,
  token: string
): Promise<{ ok: boolean; error?: string; role?: "consumer" | "farmer" }> {
  if (!email || !token) {
    return { ok: false, error: "Email and verification code are required." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = token.trim();

  const supabase = await createClient();


  let { data, error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type: "signup",
  });

  if (error) {
    const retry = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: "email",
    });
    if (!retry.error) {
      data = retry.data;
      error = null;
    }
  }

  if (error || !data?.user) {
    return {
      ok: false,
      error:
        error?.message ||
        "Invalid or expired verification code. Please check and try again.",
    };
  }

  const user = data.user;
  let role: "consumer" | "farmer" =
    (user.user_metadata?.role as "consumer" | "farmer") || "consumer";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role) {
    role = profile.role as "consumer" | "farmer";
  }

  revalidatePath("/", "layout");
  return { ok: true, role };
}

/**
 * Resends the 6-digit OTP code to the given email address.
 */
export async function resendOtpAction(
  email: string
): Promise<{ ok: boolean; error?: string }> {
  if (!email) {
    return { ok: false, error: "Email address is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim().toLowerCase(),
  });

  if (error) {
    return {
      ok: false,
      error: error.message || "Failed to resend code. Please try again shortly.",
    };
  }

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