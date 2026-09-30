import { createClient } from "@supabase/supabase-js";

/**
 * Creates an admin Supabase client using the service role key.
 * Used for server-side operations (like storage management) that require bypassing RLS.
 * Returns null if SUPABASE_SERVICE_ROLE_KEY is missing or invalid.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  // Validate that the key is actually a service_role key, not the anon key
  try {
    const parts = serviceKey.split(".");
    if (parts.length >= 2) {
      const payload = JSON.parse(
        Buffer.from(parts[1], "base64").toString("utf-8")
      );
      if (payload.role !== "service_role") {
        return null;
      }
    }
  } catch {
    // If not a standard JWT or parsing fails, continue and let Supabase handle validation
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
