"use server";

import { createClient } from "@/lib/supabase/server";
import { changePasswordSchema } from "@/lib/validations/profile";

export interface ChangePasswordState {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function changePasswordAction(
  _prev: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const raw = {
    current_password: String(formData.get("current_password") || ""),
    new_password: String(formData.get("new_password") || ""),
    confirm_password: String(formData.get("confirm_password") || ""),
  };

  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const supabase = await createClient();

  // 1. Verify the current password. This is Supabase's recommended pattern
  //    for password change — it prevents session-hijack attacks from silently
  //    rotating the password.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { ok: false, error: "You are not signed in." };
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.current_password,
  });

  if (verifyError) {
    return {
      ok: false,
      fieldErrors: { current_password: "Current password is incorrect" },
    };
  }

  // 2. Update the password
  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.new_password,
  });

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  return { ok: true };
}