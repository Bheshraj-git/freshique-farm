import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "consumer" | "farmer";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  created_at: string;
}

/**
 * Returns the Supabase auth user or null. Cached per request.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
});

/**
 * Returns the profile row for the current user or null.
 * Cached per request.
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, role, full_name, phone, avatar_url, address, city, state, country, zip_code, created_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}); 

/**
 * Server-side guard. Redirects to /login if not authenticated.
 * Returns both user and profile for convenience.
 */
export async function requireAuth(nextPath?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const next = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${next}`);
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    // Edge case: user exists in auth but no profile row.
    // Force sign-out and back to login.
    redirect("/login?error=missing_profile");
  }

  return { user, profile };
}

/**
 * Server-side guard for a specific role. Redirects if mismatch.
 */
export async function requireRole(role: UserRole, nextPath?: string) {
  const { user, profile } = await requireAuth(nextPath);
  if (profile.role !== role) {
    redirect("/");
  }
  return { user, profile };
}